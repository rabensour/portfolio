"""
Email Cleaner - Automatic email filtering and deletion for Gmail and Outlook

This tool automatically:
- Marks emails as read
- Deletes emails from blocked senders or with blocked subjects
- Supports both Gmail and Outlook
- Provides dry-run mode for safety

Author: Claude
"""

import os
import json
import pickle
import base64
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Set
import re

# Gmail imports
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Outlook/Microsoft Graph imports
import msal
import requests

# Logging
import logging


class EmailFilter:
    """Base class for email filtering logic."""

    def __init__(self, config_path: str = "filter_config.json"):
        """
        Initialize email filter with configuration.

        Args:
            config_path: Path to filter configuration file
        """
        self.config = self.load_config(config_path)
        self.blocked_senders = set(self.config.get("blocked_senders", []))
        self.blocked_subjects = set(self.config.get("blocked_subjects", []))
        self.blocked_keywords = set(self.config.get("blocked_keywords", []))

        # Setup logging
        self.setup_logging()

    def load_config(self, config_path: str) -> Dict:
        """Load filter configuration from JSON file."""
        if not os.path.exists(config_path):
            # Create default config
            default_config = {
                "blocked_senders": [],
                "blocked_subjects": [],
                "blocked_keywords": [],
                "dry_run": True
            }
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(default_config, f, indent=2, ensure_ascii=False)
            return default_config

        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def setup_logging(self):
        """Setup logging configuration."""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        log_file = log_dir / f"email_cleaner_{datetime.now().strftime('%Y%m%d')}.log"

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def should_delete(self, sender: str, subject: str) -> tuple[bool, str]:
        """
        Determine if email should be deleted based on filters.

        Args:
            sender: Email sender address
            subject: Email subject line

        Returns:
            Tuple of (should_delete: bool, reason: str)
        """
        # Check blocked senders
        sender_lower = sender.lower()
        for blocked_sender in self.blocked_senders:
            if blocked_sender.lower() in sender_lower:
                return True, f"Blocked sender: {blocked_sender}"

        # Check blocked subjects (exact match)
        subject_lower = subject.lower()
        for blocked_subject in self.blocked_subjects:
            if blocked_subject.lower() == subject_lower:
                return True, f"Blocked subject: {blocked_subject}"

        # Check blocked keywords in subject
        for keyword in self.blocked_keywords:
            if keyword.lower() in subject_lower:
                return True, f"Blocked keyword in subject: {keyword}"

        return False, ""


class GmailCleaner(EmailFilter):
    """Gmail-specific email cleaner."""

    SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

    def __init__(self, config_path: str = "filter_config.json"):
        """Initialize Gmail cleaner."""
        super().__init__(config_path)
        self.service = None
        self.dry_run = self.config.get("dry_run", True)

    def authenticate(self, credentials_path: str = "gmail_credentials.json"):
        """
        Authenticate with Gmail API.

        Args:
            credentials_path: Path to OAuth2 credentials JSON
        """
        creds = None
        token_path = "gmail_token.pickle"

        # Load existing token
        if os.path.exists(token_path):
            with open(token_path, 'rb') as token:
                creds = pickle.load(token)

        # Refresh or create new credentials
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(credentials_path):
                    raise FileNotFoundError(
                        f"Gmail credentials not found at {credentials_path}\n"
                        f"Download from: https://console.cloud.google.com/"
                    )
                flow = InstalledAppFlow.from_client_secrets_file(
                    credentials_path, self.SCOPES)
                creds = flow.run_local_server(port=0)

            # Save credentials
            with open(token_path, 'wb') as token:
                pickle.dump(creds, token)

        self.service = build('gmail', 'v1', credentials=creds)
        self.logger.info("✅ Gmail authentication successful")

    def get_unread_emails(self, max_results: int = 100) -> List[Dict]:
        """
        Get unread emails from inbox.

        Args:
            max_results: Maximum number of emails to fetch

        Returns:
            List of email dictionaries
        """
        if not self.service:
            raise RuntimeError("Not authenticated. Call authenticate() first.")

        try:
            # Get unread messages
            results = self.service.users().messages().list(
                userId='me',
                q='is:unread',
                maxResults=max_results
            ).execute()

            messages = results.get('messages', [])
            email_list = []

            for message in messages:
                # Get full message details
                msg = self.service.users().messages().get(
                    userId='me',
                    id=message['id'],
                    format='metadata',
                    metadataHeaders=['From', 'Subject']
                ).execute()

                headers = msg['payload']['headers']
                sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')

                email_list.append({
                    'id': message['id'],
                    'sender': sender,
                    'subject': subject
                })

            self.logger.info(f"📧 Found {len(email_list)} unread emails")
            return email_list

        except HttpError as error:
            self.logger.error(f"❌ Gmail API error: {error}")
            return []

    def mark_as_read(self, message_id: str) -> bool:
        """Mark email as read."""
        try:
            self.service.users().messages().modify(
                userId='me',
                id=message_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
            return True
        except HttpError as error:
            self.logger.error(f"❌ Error marking as read: {error}")
            return False

    def delete_email(self, message_id: str) -> bool:
        """Delete email (move to trash)."""
        try:
            self.service.users().messages().trash(
                userId='me',
                id=message_id
            ).execute()
            return True
        except HttpError as error:
            self.logger.error(f"❌ Error deleting email: {error}")
            return False

    def process_emails(self) -> Dict[str, int]:
        """
        Process all unread emails based on filters.

        Returns:
            Dictionary with processing statistics
        """
        stats = {
            'total': 0,
            'deleted': 0,
            'marked_read': 0,
            'skipped': 0
        }

        emails = self.get_unread_emails()
        stats['total'] = len(emails)

        for email in emails:
            should_delete, reason = self.should_delete(
                email['sender'],
                email['subject']
            )

            if should_delete:
                self.logger.info(f"🎯 {reason}")
                self.logger.info(f"   From: {email['sender']}")
                self.logger.info(f"   Subject: {email['subject']}")

                if self.dry_run:
                    self.logger.info("   [DRY RUN] Would mark as read and delete")
                    stats['deleted'] += 1
                else:
                    # Mark as read
                    if self.mark_as_read(email['id']):
                        stats['marked_read'] += 1

                    # Delete
                    if self.delete_email(email['id']):
                        stats['deleted'] += 1
                        self.logger.info("   ✅ Marked as read and deleted")
            else:
                stats['skipped'] += 1

        return stats


class OutlookCleaner(EmailFilter):
    """Outlook/Microsoft 365 email cleaner using Microsoft Graph API."""

    SCOPES = ['Mail.ReadWrite']

    def __init__(self, config_path: str = "filter_config.json"):
        """Initialize Outlook cleaner."""
        super().__init__(config_path)
        self.access_token = None
        self.dry_run = self.config.get("dry_run", True)

    def authenticate(self, client_id: str, tenant_id: str = "common"):
        """
        Authenticate with Microsoft Graph API.

        Args:
            client_id: Azure AD application client ID
            tenant_id: Azure AD tenant ID (default: 'common')
        """
        authority = f"https://login.microsoftonline.com/{tenant_id}"

        # Create MSAL app
        app = msal.PublicClientApplication(
            client_id,
            authority=authority
        )

        # Try to get token from cache
        accounts = app.get_accounts()
        result = None

        if accounts:
            result = app.acquire_token_silent(self.SCOPES, account=accounts[0])

        if not result:
            # Interactive login
            result = app.acquire_token_interactive(scopes=self.SCOPES)

        if "access_token" in result:
            self.access_token = result['access_token']
            self.logger.info("✅ Outlook authentication successful")
        else:
            error = result.get("error_description", "Unknown error")
            raise RuntimeError(f"Outlook authentication failed: {error}")

    def get_unread_emails(self, max_results: int = 100) -> List[Dict]:
        """
        Get unread emails from Outlook inbox.

        Args:
            max_results: Maximum number of emails to fetch

        Returns:
            List of email dictionaries
        """
        if not self.access_token:
            raise RuntimeError("Not authenticated. Call authenticate() first.")

        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

        # Query unread messages
        url = f"https://graph.microsoft.com/v1.0/me/messages"
        params = {
            '$filter': 'isRead eq false',
            '$top': max_results,
            '$select': 'id,subject,from'
        }

        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            messages = response.json().get('value', [])
            email_list = []

            for msg in messages:
                email_list.append({
                    'id': msg['id'],
                    'sender': msg['from']['emailAddress']['address'],
                    'subject': msg.get('subject', '')
                })

            self.logger.info(f"📧 Found {len(email_list)} unread emails")
            return email_list
        else:
            self.logger.error(f"❌ Error fetching emails: {response.status_code}")
            return []

    def mark_as_read(self, message_id: str) -> bool:
        """Mark email as read."""
        if not self.access_token:
            return False

        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

        url = f"https://graph.microsoft.com/v1.0/me/messages/{message_id}"
        data = {'isRead': True}

        response = requests.patch(url, headers=headers, json=data)
        return response.status_code == 200

    def delete_email(self, message_id: str) -> bool:
        """Delete email."""
        if not self.access_token:
            return False

        headers = {
            'Authorization': f'Bearer {self.access_token}'
        }

        url = f"https://graph.microsoft.com/v1.0/me/messages/{message_id}"
        response = requests.delete(url, headers=headers)
        return response.status_code == 204

    def process_emails(self) -> Dict[str, int]:
        """
        Process all unread emails based on filters.

        Returns:
            Dictionary with processing statistics
        """
        stats = {
            'total': 0,
            'deleted': 0,
            'marked_read': 0,
            'skipped': 0
        }

        emails = self.get_unread_emails()
        stats['total'] = len(emails)

        for email in emails:
            should_delete, reason = self.should_delete(
                email['sender'],
                email['subject']
            )

            if should_delete:
                self.logger.info(f"🎯 {reason}")
                self.logger.info(f"   From: {email['sender']}")
                self.logger.info(f"   Subject: {email['subject']}")

                if self.dry_run:
                    self.logger.info("   [DRY RUN] Would mark as read and delete")
                    stats['deleted'] += 1
                else:
                    # Mark as read
                    if self.mark_as_read(email['id']):
                        stats['marked_read'] += 1

                    # Delete
                    if self.delete_email(email['id']):
                        stats['deleted'] += 1
                        self.logger.info("   ✅ Marked as read and deleted")
            else:
                stats['skipped'] += 1

        return stats


def print_stats(stats: Dict[str, int], service: str, dry_run: bool):
    """Print processing statistics."""
    print(f"\n{'='*60}")
    print(f"📊 {service} Processing Summary")
    print(f"{'='*60}")
    print(f"Total emails checked: {stats['total']}")
    print(f"Deleted: {stats['deleted']}")
    print(f"Marked as read: {stats['marked_read']}")
    print(f"Skipped: {stats['skipped']}")

    if dry_run:
        print(f"\n⚠️  DRY RUN MODE - No emails were actually deleted")
        print(f"Set 'dry_run': false in filter_config.json to delete emails")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    print("""
╔════════════════════════════════════════════════════════════════╗
║                    Email Cleaner Tool                          ║
║            Automatic Gmail & Outlook Email Filtering           ║
╚════════════════════════════════════════════════════════════════╝
""")

    # Example: Clean Gmail
    print("Starting Gmail cleanup...")
    try:
        gmail = GmailCleaner()
        gmail.authenticate()
        stats = gmail.process_emails()
        print_stats(stats, "Gmail", gmail.dry_run)
    except FileNotFoundError as e:
        print(f"⚠️  Gmail: {e}")
    except Exception as e:
        print(f"❌ Gmail error: {e}")

    # Example: Clean Outlook
    # Uncomment and configure with your Azure AD app
    # print("\nStarting Outlook cleanup...")
    # try:
    #     outlook = OutlookCleaner()
    #     outlook.authenticate(client_id="YOUR_CLIENT_ID")
    #     stats = outlook.process_emails()
    #     print_stats(stats, "Outlook", outlook.dry_run)
    # except Exception as e:
    #     print(f"❌ Outlook error: {e}")
