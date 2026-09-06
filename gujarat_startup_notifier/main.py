import sys
import os
import time
import argparse
import logging
import datetime

# Force UTF-8 on Windows consoles to prevent UnicodeEncodeErrors with emojis
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Configure clean logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("GujaratStartupNotifier")

try:
    from .db import init_db, mark_as_sent
    from .fetcher import get_recent_gujarat_startup_news
    from .notifier import send_telegram_alert, send_email_alert
except ImportError:
    from db import init_db, mark_as_sent
    from fetcher import get_recent_gujarat_startup_news
    from notifier import send_telegram_alert, send_email_alert

def run_daily_digest():
    """Core pipeline: Fetch -> Deduplicate -> Send Notifications -> Cache Sent Items."""
    logger.info("=== Starting Gujarat Startup News Briefing Pipeline ===")
    
    # 1. Fetch fresh news
    news_items = get_recent_gujarat_startup_news()
    
    if not news_items:
        logger.info("No fresh news items found matching criteria. Pipeline complete.")
        return

    logger.info(f"Dispatching notifications for {len(news_items)} updates...")

    # 2. Dispatch to enabled channels
    telegram_success = send_telegram_alert(news_items)
    email_success = send_email_alert(news_items)

    # 3. Mark items as sent in database if at least one channel succeeded (or in dev mode)
    if telegram_success or email_success:
        mark_as_sent(news_items)
        logger.info(f"Marked {len(news_items)} items as processed in SQLite store.")
    else:
        logger.warning("No notification channels succeeded. Check your credentials in .env.")

    logger.info("=== Daily Digest Processed Successfully ===")

def run_scheduler():
    """Run an internal continuous scheduler for 8:00 AM IST (UTC 02:30)."""
    try:
        import schedule
    except ImportError:
        logger.error("The 'schedule' package is required to run in daemon mode. Run: pip install schedule")
        sys.exit(1)

    # 8:00 AM IST is 02:30 AM UTC
    IST_SCHEDULE_TIME = "08:00"
    logger.info(f"Scheduler active. Job will run every day at {IST_SCHEDULE_TIME} (Local/IST).")
    
    schedule.every().day.at(IST_SCHEDULE_TIME).do(run_daily_digest)

    while True:
        schedule.run_pending()
        time.sleep(30)

def main():
    parser = argparse.ArgumentParser(description="Automated Gujarat Startup News & Policy Notifier")
    parser.add_argument("--daemon", action="store_true", help="Run continuously with internal cron scheduler at 8:00 AM IST")
    parser.add_argument("--now", action="store_true", help="Run once immediately and exit (Default)")
    args = parser.parse_args()

    # Initialize SQLite database
    init_db()

    if args.daemon:
        run_scheduler()
    else:
        run_daily_digest()

if __name__ == "__main__":
    main()
