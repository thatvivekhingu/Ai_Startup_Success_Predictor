import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ==========================================
# Google News RSS Queries for Gujarat Ecosystem
# ==========================================
RSS_QUERIES = [
    "Gujarat Startup Policy",
    "i-Hub Gujarat",
    "GUSEC Gujarat SSIP",
    "iCreate Gandhinagar startup",
    "Gujarat Student Startup Innovation Policy",
    "Gujarat Venture Finance GVFL startup"
]

# Google News RSS base URL pattern
GOOGLE_NEWS_RSS_URL = "https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"

# Database Configuration
DB_PATH = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "news_cache.db"))

# Time window for fresh news (hours)
NEWS_LOOKBACK_HOURS = int(os.getenv("NEWS_LOOKBACK_HOURS", "24"))

# Max items to include in daily digest
MAX_NEWS_ITEMS = int(os.getenv("MAX_NEWS_ITEMS", "6"))

# ==========================================
# Notification Channels
# ==========================================
# Telegram Bot Configuration
ENABLE_TELEGRAM = os.getenv("ENABLE_TELEGRAM", "true").lower() == "true"
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

# Email SMTP Configuration
ENABLE_EMAIL = os.getenv("ENABLE_EMAIL", "false").lower() == "true"
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # App Password for Gmail
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USER)
EMAIL_TO = os.getenv("EMAIL_TO", "")  # Can be comma-separated
