#!/usr/bin/env python3
"""
Simple email cleaner script - Easy to use interface

Usage:
    python clean_emails.py gmail          # Clean Gmail only
    python clean_emails.py outlook        # Clean Outlook only
    python clean_emails.py both           # Clean both
    python clean_emails.py configure      # Edit filter configuration
"""

import sys
import json
import subprocess
import os
from email_cleaner import GmailCleaner, OutlookCleaner, print_stats


def edit_config():
    """Open configuration file for editing."""
    config_file = "filter_config.json"

    print(f"\n📝 Opening {config_file} for editing...")
    print("\nCurrent configuration:")
    print("=" * 60)

    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
        print(json.dumps(config, indent=2, ensure_ascii=False))

    print("=" * 60)
    print("\nEdit this file to add/remove filters:")
    print(f"  - blocked_senders: Email addresses to block")
    print(f"  - blocked_subjects: Exact subject lines to block")
    print(f"  - blocked_keywords: Keywords in subject to block")
    print(f"  - dry_run: true (test mode) or false (actually delete)")

    # Open in default editor
    if sys.platform == 'win32':
        os.startfile(config_file)
    elif sys.platform == 'darwin':
        subprocess.call(['open', config_file])
    else:
        subprocess.call(['xdg-open', config_file])


def add_blocked_sender():
    """Interactive mode to add blocked sender."""
    print("\n➕ Add Blocked Sender")
    print("=" * 60)

    email = input("Enter email address or domain to block: ").strip()

    if not email:
        print("❌ No email provided")
        return

    # Load config
    with open('filter_config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)

    # Add sender
    if email not in config['blocked_senders']:
        config['blocked_senders'].append(email)

        # Save config
        with open('filter_config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        print(f"✅ Added: {email}")
        print(f"Total blocked senders: {len(config['blocked_senders'])}")
    else:
        print(f"⚠️  Already blocked: {email}")


def add_blocked_keyword():
    """Interactive mode to add blocked keyword."""
    print("\n➕ Add Blocked Keyword")
    print("=" * 60)

    keyword = input("Enter keyword to block in subjects: ").strip()

    if not keyword:
        print("❌ No keyword provided")
        return

    # Load config
    with open('filter_config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)

    # Add keyword
    if keyword not in config['blocked_keywords']:
        config['blocked_keywords'].append(keyword)

        # Save config
        with open('filter_config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        print(f"✅ Added keyword: {keyword}")
        print(f"Total blocked keywords: {len(config['blocked_keywords'])}")
    else:
        print(f"⚠️  Already blocked: {keyword}")


def show_filters():
    """Display current filters."""
    print("\n📋 Current Filters")
    print("=" * 60)

    with open('filter_config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)

    print(f"\n🚫 Blocked Senders ({len(config['blocked_senders'])}):")
    for sender in config['blocked_senders']:
        print(f"  - {sender}")

    print(f"\n🚫 Blocked Subjects ({len(config['blocked_subjects'])}):")
    for subject in config['blocked_subjects']:
        print(f"  - {subject}")

    print(f"\n🚫 Blocked Keywords ({len(config['blocked_keywords'])}):")
    for keyword in config['blocked_keywords']:
        print(f"  - {keyword}")

    print(f"\n⚙️  Mode: {'DRY RUN (test only)' if config['dry_run'] else 'LIVE (will delete!)'}")
    print("=" * 60)


def toggle_dry_run():
    """Toggle dry run mode."""
    with open('filter_config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)

    config['dry_run'] = not config['dry_run']

    with open('filter_config.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

    mode = "DRY RUN (test mode)" if config['dry_run'] else "LIVE MODE (will actually delete)"
    print(f"✅ Mode changed to: {mode}")


def clean_gmail():
    """Clean Gmail inbox."""
    print("\n🔵 Cleaning Gmail...")
    print("=" * 60)

    try:
        cleaner = GmailCleaner()
        cleaner.authenticate()
        stats = cleaner.process_emails()
        print_stats(stats, "Gmail", cleaner.dry_run)
        return True
    except FileNotFoundError:
        print("❌ Gmail credentials not found!")
        print("\nSetup instructions:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a project and enable Gmail API")
        print("3. Create OAuth2 credentials")
        print("4. Download as 'gmail_credentials.json'")
        print("5. Place in this folder")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def clean_outlook():
    """Clean Outlook inbox."""
    print("\n🔷 Cleaning Outlook...")
    print("=" * 60)

    try:
        # Check for Outlook config
        if not os.path.exists('outlook_config.json'):
            print("❌ Outlook not configured!")
            print("\nSetup instructions:")
            print("1. Create outlook_config.json with:")
            print('   {"client_id": "your-app-id", "tenant_id": "common"}')
            print("2. Register app at https://portal.azure.com/")
            return False

        with open('outlook_config.json', 'r') as f:
            outlook_config = json.load(f)

        cleaner = OutlookCleaner()
        cleaner.authenticate(
            client_id=outlook_config['client_id'],
            tenant_id=outlook_config.get('tenant_id', 'common')
        )
        stats = cleaner.process_emails()
        print_stats(stats, "Outlook", cleaner.dry_run)
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def interactive_menu():
    """Interactive menu."""
    while True:
        print("""
╔════════════════════════════════════════════════════════════════╗
║                    Email Cleaner Menu                          ║
╚════════════════════════════════════════════════════════════════╝

1. Clean Gmail
2. Clean Outlook
3. Clean both Gmail & Outlook
4. Show current filters
5. Add blocked sender
6. Add blocked keyword
7. Toggle dry run mode
8. Edit configuration file
9. Exit

""")

        choice = input("Select option (1-9): ").strip()

        if choice == '1':
            clean_gmail()
        elif choice == '2':
            clean_outlook()
        elif choice == '3':
            clean_gmail()
            clean_outlook()
        elif choice == '4':
            show_filters()
        elif choice == '5':
            add_blocked_sender()
        elif choice == '6':
            add_blocked_keyword()
        elif choice == '7':
            toggle_dry_run()
        elif choice == '8':
            edit_config()
        elif choice == '9':
            print("\n👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

        input("\nPress Enter to continue...")


def main():
    """Main entry point."""
    print("""
╔════════════════════════════════════════════════════════════════╗
║                    Email Cleaner Tool                          ║
║            Automatic Gmail & Outlook Filtering                 ║
╚════════════════════════════════════════════════════════════════╝
""")

    if len(sys.argv) < 2:
        interactive_menu()
        return

    command = sys.argv[1].lower()

    if command == 'gmail':
        clean_gmail()
    elif command == 'outlook':
        clean_outlook()
    elif command == 'both':
        clean_gmail()
        clean_outlook()
    elif command == 'configure':
        edit_config()
    elif command == 'menu':
        interactive_menu()
    elif command == 'filters':
        show_filters()
    elif command == 'add-sender':
        add_blocked_sender()
    elif command == 'add-keyword':
        add_blocked_keyword()
    else:
        print(f"❌ Unknown command: {command}")
        print("\nUsage:")
        print("  python clean_emails.py gmail         # Clean Gmail")
        print("  python clean_emails.py outlook       # Clean Outlook")
        print("  python clean_emails.py both          # Clean both")
        print("  python clean_emails.py menu          # Interactive menu")
        print("  python clean_emails.py filters       # Show filters")
        print("  python clean_emails.py add-sender    # Add blocked sender")
        print("  python clean_emails.py configure     # Edit config")


if __name__ == "__main__":
    main()
