"""
Email Cleaner - Advanced Usage Examples

This file demonstrates advanced usage patterns and customizations
for the email cleaner tool.
"""

from email_cleaner import GmailCleaner, OutlookCleaner, EmailFilter
import json
from datetime import datetime, timedelta


# ============================================================================
# Example 1: Custom Filter Logic
# ============================================================================

class CustomEmailFilter(EmailFilter):
    """
    Custom filter with additional logic beyond the standard filters.
    """

    def should_delete_advanced(self, sender: str, subject: str, date: datetime) -> tuple[bool, str]:
        """
        Advanced filtering with custom rules.

        Args:
            sender: Email sender
            subject: Email subject
            date: Email date

        Returns:
            Tuple of (should_delete, reason)
        """
        # Standard filters first
        should_delete, reason = self.should_delete(sender, subject)
        if should_delete:
            return should_delete, reason

        # Custom rule 1: Delete old promotional emails (>30 days old)
        promotional_keywords = ['sale', 'discount', 'offer', 'promo']
        if any(keyword in subject.lower() for keyword in promotional_keywords):
            days_old = (datetime.now() - date).days
            if days_old > 30:
                return True, f"Old promotional email ({days_old} days old)"

        # Custom rule 2: Delete emails from specific domain patterns
        suspicious_patterns = ['.xyz', '.top', '.click']
        if any(pattern in sender.lower() for pattern in suspicious_patterns):
            return True, f"Suspicious domain pattern"

        # Custom rule 3: Delete emails with too many capital letters in subject
        if len(subject) > 0:
            caps_ratio = sum(1 for c in subject if c.isupper()) / len(subject)
            if caps_ratio > 0.7:  # More than 70% caps
                return True, "Excessive capitals in subject (likely spam)"

        return False, ""


# ============================================================================
# Example 2: Batch Processing Multiple Accounts
# ============================================================================

def clean_multiple_gmail_accounts():
    """
    Clean multiple Gmail accounts sequentially.
    Requires multiple credential files.
    """
    accounts = [
        {"name": "Personal", "creds": "gmail_credentials_personal.json"},
        {"name": "Work", "creds": "gmail_credentials_work.json"},
    ]

    for account in accounts:
        print(f"\n{'=' * 60}")
        print(f"Processing {account['name']} account...")
        print(f"{'=' * 60}")

        try:
            cleaner = GmailCleaner()
            cleaner.authenticate(credentials_path=account['creds'])
            stats = cleaner.process_emails()

            print(f"\n✅ {account['name']}: {stats['deleted']} emails deleted")
        except Exception as e:
            print(f"❌ {account['name']}: Error - {e}")


# ============================================================================
# Example 3: Conditional Cleaning Based on Count
# ============================================================================

def smart_clean():
    """
    Only clean if there are more than X unread emails.
    Useful for scheduled tasks to avoid unnecessary API calls.
    """
    MIN_EMAILS_TO_CLEAN = 10

    cleaner = GmailCleaner()
    cleaner.authenticate()

    # Get unread count first
    emails = cleaner.get_unread_emails()

    if len(emails) < MIN_EMAILS_TO_CLEAN:
        print(f"Only {len(emails)} unread emails. Skipping cleanup.")
        return

    print(f"Found {len(emails)} unread emails. Starting cleanup...")
    stats = cleaner.process_emails()
    print(f"✅ Deleted {stats['deleted']} emails")


# ============================================================================
# Example 4: Whitelist Support
# ============================================================================

class WhitelistFilter(EmailFilter):
    """
    Filter with whitelist support - never delete from certain senders.
    """

    def __init__(self, config_path: str = "filter_config.json"):
        super().__init__(config_path)
        self.whitelisted_senders = set(self.config.get("whitelisted_senders", []))

    def should_delete(self, sender: str, subject: str) -> tuple[bool, str]:
        """
        Check if email should be deleted, respecting whitelist.
        """
        # Check whitelist first
        sender_lower = sender.lower()
        for whitelisted in self.whitelisted_senders:
            if whitelisted.lower() in sender_lower:
                return False, f"Whitelisted sender: {whitelisted}"

        # Then apply standard filters
        return super().should_delete(sender, subject)


# ============================================================================
# Example 5: Report Generation
# ============================================================================

def generate_cleanup_report(stats: dict, service: str):
    """
    Generate a detailed HTML report of cleanup activities.
    """
    report_html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Email Cleanup Report - {service}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        .header {{ background: #4CAF50; color: white; padding: 20px; }}
        .stats {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }}
        .stat-card {{ background: #f5f5f5; padding: 20px; border-radius: 8px; }}
        .stat-number {{ font-size: 48px; font-weight: bold; color: #4CAF50; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📧 {service} Cleanup Report</h1>
        <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <h3>Emails Checked</h3>
            <div class="stat-number">{stats['total']}</div>
        </div>
        <div class="stat-card">
            <h3>Emails Deleted</h3>
            <div class="stat-number">{stats['deleted']}</div>
        </div>
        <div class="stat-card">
            <h3>Emails Kept</h3>
            <div class="stat-number">{stats['skipped']}</div>
        </div>
        <div class="stat-card">
            <h3>Deletion Rate</h3>
            <div class="stat-number">
                {stats['deleted'] / stats['total'] * 100 if stats['total'] > 0 else 0:.1f}%
            </div>
        </div>
    </div>
</body>
</html>
"""

    # Save report
    report_path = f"reports/cleanup_{service}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"

    import os
    os.makedirs('reports', exist_ok=True)

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_html)

    print(f"📊 Report saved to: {report_path}")


# ============================================================================
# Example 6: Different Configs for Different Times
# ============================================================================

def time_based_cleaning():
    """
    Use different filter configs based on time of day.
    """
    current_hour = datetime.now().hour

    # Aggressive cleaning during work hours (9-17)
    if 9 <= current_hour <= 17:
        config_file = "filter_config_aggressive.json"
        print("🔥 Using aggressive filters (work hours)")
    else:
        config_file = "filter_config.json"
        print("📧 Using standard filters")

    cleaner = GmailCleaner(config_path=config_file)
    cleaner.authenticate()
    stats = cleaner.process_emails()

    return stats


# ============================================================================
# Example 7: Archive Instead of Delete
# ============================================================================

class ArchivingGmailCleaner(GmailCleaner):
    """
    Gmail cleaner that archives emails instead of deleting them.
    """

    def archive_email(self, message_id: str) -> bool:
        """Archive email (remove from inbox)."""
        try:
            self.service.users().messages().modify(
                userId='me',
                id=message_id,
                body={'removeLabelIds': ['INBOX', 'UNREAD']}
            ).execute()
            return True
        except Exception as e:
            self.logger.error(f"❌ Error archiving: {e}")
            return False

    def process_emails(self) -> dict:
        """Process emails - archive instead of delete."""
        stats = {
            'total': 0,
            'archived': 0,
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
                    self.logger.info("   [DRY RUN] Would mark as read and archive")
                    stats['archived'] += 1
                else:
                    if self.archive_email(email['id']):
                        stats['archived'] += 1
                        self.logger.info("   ✅ Archived")
            else:
                stats['skipped'] += 1

        return stats


# ============================================================================
# Example 8: Notification on Cleanup
# ============================================================================

def clean_with_notification():
    """
    Send a notification after cleanup completes.
    """
    cleaner = GmailCleaner()
    cleaner.authenticate()
    stats = cleaner.process_emails()

    # Windows notification
    try:
        from win10toast import ToastNotifier
        toaster = ToastNotifier()
        toaster.show_toast(
            "Email Cleaner",
            f"Cleanup complete! {stats['deleted']} emails deleted.",
            duration=10
        )
    except ImportError:
        print("Install win10toast for notifications: pip install win10toast")

    return stats


# ============================================================================
# Main - Run Examples
# ============================================================================

if __name__ == "__main__":
    print("""
╔════════════════════════════════════════════════════════════════╗
║              Email Cleaner - Advanced Examples                 ║
╚════════════════════════════════════════════════════════════════╝

Choose an example to run:

1. Custom filter logic (age-based, pattern-based)
2. Multiple Gmail accounts
3. Smart cleanup (only if >X emails)
4. Whitelist support
5. Generate HTML report
6. Time-based filtering
7. Archive instead of delete
8. Cleanup with notification
9. Exit
""")

    choice = input("Select example (1-9): ").strip()

    if choice == "1":
        print("\n🎯 Custom Filter Example")
        print("This would use custom filtering logic...")
        print("See CustomEmailFilter class in this file")

    elif choice == "2":
        print("\n📧 Multiple Accounts Example")
        print("This would clean multiple Gmail accounts...")
        print("See clean_multiple_gmail_accounts() in this file")

    elif choice == "3":
        print("\n🧠 Smart Cleanup Example")
        smart_clean()

    elif choice == "4":
        print("\n✅ Whitelist Example")
        print("See WhitelistFilter class in this file")
        print("\nAdd to filter_config.json:")
        print(json.dumps({"whitelisted_senders": ["important@example.com"]}, indent=2))

    elif choice == "5":
        print("\n📊 Report Generation Example")
        # Example stats
        example_stats = {'total': 100, 'deleted': 25, 'skipped': 75, 'marked_read': 25}
        generate_cleanup_report(example_stats, "Gmail")

    elif choice == "6":
        print("\n⏰ Time-Based Filtering Example")
        stats = time_based_cleaning()
        print(f"Stats: {stats}")

    elif choice == "7":
        print("\n📦 Archive Example")
        print("See ArchivingGmailCleaner class in this file")

    elif choice == "8":
        print("\n🔔 Notification Example")
        clean_with_notification()

    elif choice == "9":
        print("\n👋 Goodbye!")

    else:
        print("\n❌ Invalid choice")
