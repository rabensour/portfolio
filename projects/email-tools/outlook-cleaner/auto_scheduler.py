"""
Email Cleaner - Automatic Scheduler

This script runs the email cleaner at scheduled times automatically.
Perfect for automated daily/weekly email cleanup.

Usage:
    python auto_scheduler.py

Configuration:
    Edit the schedule settings below to customize when emails are cleaned.
"""

import schedule
import time
from datetime import datetime
import logging
from pathlib import Path

# Import our cleaners
from email_cleaner import GmailCleaner, OutlookCleaner, print_stats


# ============================================================================
# CONFIGURATION - Modify these settings
# ============================================================================

# What to clean
CLEAN_GMAIL = True
CLEAN_OUTLOOK = False  # Set to True if you want to clean Outlook too

# Outlook credentials (only needed if CLEAN_OUTLOOK = True)
OUTLOOK_CLIENT_ID = "YOUR_CLIENT_ID_HERE"
OUTLOOK_TENANT_ID = "common"

# Schedule configuration
SCHEDULE_TIME = "08:00"  # Time to run (24h format: "HH:MM")
SCHEDULE_DAYS = "daily"  # Options: "daily", "weekdays", "weekends", "monday", "tuesday", etc.

# ============================================================================


class EmailScheduler:
    """Automated email cleaner scheduler."""

    def __init__(self):
        """Initialize the scheduler."""
        self.setup_logging()
        self.gmail_cleaner = None
        self.outlook_cleaner = None

        # Authenticate services
        if CLEAN_GMAIL:
            try:
                self.logger.info("Authenticating Gmail...")
                self.gmail_cleaner = GmailCleaner()
                self.gmail_cleaner.authenticate()
                self.logger.info("✅ Gmail authenticated")
            except Exception as e:
                self.logger.error(f"❌ Gmail authentication failed: {e}")

        if CLEAN_OUTLOOK:
            try:
                self.logger.info("Authenticating Outlook...")
                self.outlook_cleaner = OutlookCleaner()
                self.outlook_cleaner.authenticate(
                    client_id=OUTLOOK_CLIENT_ID,
                    tenant_id=OUTLOOK_TENANT_ID
                )
                self.logger.info("✅ Outlook authenticated")
            except Exception as e:
                self.logger.error(f"❌ Outlook authentication failed: {e}")

    def setup_logging(self):
        """Setup logging for the scheduler."""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        log_file = log_dir / f"scheduler_{datetime.now().strftime('%Y%m%d')}.log"

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def clean_gmail(self):
        """Clean Gmail inbox."""
        if not self.gmail_cleaner:
            self.logger.warning("Gmail cleaner not configured")
            return

        self.logger.info("=" * 60)
        self.logger.info("🔵 Starting Gmail cleanup")
        self.logger.info("=" * 60)

        try:
            stats = self.gmail_cleaner.process_emails()
            print_stats(stats, "Gmail", self.gmail_cleaner.dry_run)
            self.logger.info(f"Gmail cleanup complete: {stats['deleted']} deleted")
        except Exception as e:
            self.logger.error(f"❌ Gmail cleanup failed: {e}")

    def clean_outlook(self):
        """Clean Outlook inbox."""
        if not self.outlook_cleaner:
            self.logger.warning("Outlook cleaner not configured")
            return

        self.logger.info("=" * 60)
        self.logger.info("🔷 Starting Outlook cleanup")
        self.logger.info("=" * 60)

        try:
            stats = self.outlook_cleaner.process_emails()
            print_stats(stats, "Outlook", self.outlook_cleaner.dry_run)
            self.logger.info(f"Outlook cleanup complete: {stats['deleted']} deleted")
        except Exception as e:
            self.logger.error(f"❌ Outlook cleanup failed: {e}")

    def clean_all(self):
        """Clean all configured email services."""
        self.logger.info("🤖 Scheduled cleanup starting...")
        self.logger.info(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        if CLEAN_GMAIL:
            self.clean_gmail()

        if CLEAN_OUTLOOK:
            self.clean_outlook()

        self.logger.info("✅ Scheduled cleanup complete")
        self.logger.info("")

    def setup_schedule(self):
        """Setup the cleaning schedule."""
        if SCHEDULE_DAYS == "daily":
            schedule.every().day.at(SCHEDULE_TIME).do(self.clean_all)
            schedule_desc = f"daily at {SCHEDULE_TIME}"

        elif SCHEDULE_DAYS == "weekdays":
            schedule.every().monday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule.every().tuesday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule.every().wednesday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule.every().thursday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule.every().friday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule_desc = f"weekdays at {SCHEDULE_TIME}"

        elif SCHEDULE_DAYS == "weekends":
            schedule.every().saturday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule.every().sunday.at(SCHEDULE_TIME).do(self.clean_all)
            schedule_desc = f"weekends at {SCHEDULE_TIME}"

        elif SCHEDULE_DAYS in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]:
            getattr(schedule.every(), SCHEDULE_DAYS).at(SCHEDULE_TIME).do(self.clean_all)
            schedule_desc = f"every {SCHEDULE_DAYS} at {SCHEDULE_TIME}"

        else:
            # Default to daily
            schedule.every().day.at(SCHEDULE_TIME).do(self.clean_all)
            schedule_desc = f"daily at {SCHEDULE_TIME}"
            self.logger.warning(f"Unknown schedule '{SCHEDULE_DAYS}', defaulting to daily")

        return schedule_desc

    def run(self):
        """Run the scheduler."""
        schedule_desc = self.setup_schedule()

        print("""
╔════════════════════════════════════════════════════════════════╗
║              Email Cleaner - Auto Scheduler                    ║
╚════════════════════════════════════════════════════════════════╝
""")

        print(f"📅 Schedule: {schedule_desc}")
        print(f"📧 Services:")
        if CLEAN_GMAIL:
            print(f"   ✅ Gmail")
        if CLEAN_OUTLOOK:
            print(f"   ✅ Outlook")

        print(f"\n⏰ Next run: {schedule.next_run()}")
        print(f"\n🔄 Scheduler is running... (Press Ctrl+C to stop)")
        print("=" * 60)

        self.logger.info("Scheduler started")
        self.logger.info(f"Schedule: {schedule_desc}")

        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            print("\n\n👋 Scheduler stopped by user")
            self.logger.info("Scheduler stopped by user")


def main():
    """Main entry point."""

    # Validate configuration
    if not CLEAN_GMAIL and not CLEAN_OUTLOOK:
        print("❌ Error: No services configured!")
        print("Please set CLEAN_GMAIL or CLEAN_OUTLOOK to True in this file.")
        return

    if CLEAN_OUTLOOK and OUTLOOK_CLIENT_ID == "YOUR_CLIENT_ID_HERE":
        print("❌ Error: Outlook client ID not configured!")
        print("Please set OUTLOOK_CLIENT_ID in this file.")
        return

    # Create and run scheduler
    scheduler = EmailScheduler()
    scheduler.run()


if __name__ == "__main__":
    # Check if schedule module is installed
    try:
        import schedule
    except ImportError:
        print("❌ Error: 'schedule' module not installed")
        print("\nInstall it with:")
        print("    pip install schedule")
        exit(1)

    main()
