import sqlite3
import hashlib
import logging
try:
    from .config import DB_PATH
except ImportError:
    from config import DB_PATH

logger = logging.getLogger(__name__)

def init_db():
    """Initialize SQLite database for storing processed news links."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS processed_news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hash_id TEXT UNIQUE,
            title TEXT,
            link TEXT,
            published_at TEXT,
            source TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    logger.info(f"Database initialized at {DB_PATH}")

def compute_hash(title: str, link: str) -> str:
    """Generate MD5 hash based on normalized title and link."""
    content = f"{title.strip().lower()}|{link.strip()}"
    return hashlib.md5(content.encode("utf-8")).hexdigest()

def is_duplicate(title: str, link: str) -> bool:
    """Check if the news item has already been sent."""
    hash_id = compute_hash(title, link)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM processed_news WHERE hash_id = ?", (hash_id,))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def mark_as_sent(items: list):
    """Mark a list of news items as sent."""
    if not items:
        return
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for item in items:
        hash_id = compute_hash(item["title"], item["link"])
        cursor.execute("""
            INSERT OR IGNORE INTO processed_news (hash_id, title, link, published_at, source)
            VALUES (?, ?, ?, ?, ?)
        """, (hash_id, item["title"], item["link"], item.get("published", ""), item.get("source", "")))
    conn.commit()
    conn.close()
