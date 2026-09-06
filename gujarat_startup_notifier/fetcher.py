import urllib.parse
import datetime
import logging
from typing import List, Dict
import requests
import xml.etree.ElementTree as ET
try:
    from .config import RSS_QUERIES, GOOGLE_NEWS_RSS_URL, NEWS_LOOKBACK_HOURS, MAX_NEWS_ITEMS
    from .db import is_duplicate
except ImportError:
    from config import RSS_QUERIES, GOOGLE_NEWS_RSS_URL, NEWS_LOOKBACK_HOURS, MAX_NEWS_ITEMS
    from db import is_duplicate

logger = logging.getLogger(__name__)

# Try to import feedparser if available, else use standard ElementTree
try:
    import feedparser
    HAS_FEEDPARSER = True
except ImportError:
    HAS_FEEDPARSER = False

def fetch_rss_feed(query: str) -> List[Dict]:
    """Fetch and parse RSS feed for a single search query."""
    encoded_query = urllib.parse.quote(query)
    feed_url = GOOGLE_NEWS_RSS_URL.format(query=encoded_query)
    items = []

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(feed_url, headers=headers, timeout=12)
        if response.status_code != 200:
            logger.warning(f"Failed to fetch RSS for query '{query}': HTTP {response.status_code}")
            return []

        if HAS_FEEDPARSER:
            feed = feedparser.parse(response.content)
            for entry in feed.entries:
                title = entry.get("title", "").strip()
                link = entry.get("link", "").strip()
                source = entry.get("source", {}).get("title", "News Source")
                
                # Split Google News title suffix if source is repeated (e.g. "Title - The Times of India")
                if " - " in title and source == "News Source":
                    parts = title.rsplit(" - ", 1)
                    title = parts[0]
                    source = parts[1]

                published_parsed = entry.get("published_parsed")
                pub_date = None
                if published_parsed:
                    try:
                        pub_date = datetime.datetime(*published_parsed[:6], tzinfo=datetime.timezone.utc)
                    except Exception:
                        pass

                items.append({
                    "title": title,
                    "link": link,
                    "source": source,
                    "published_dt": pub_date,
                    "published": entry.get("published", "Recent"),
                    "query": query
                })
        else:
            # Fallback to XML ElementTree
            root = ET.fromstring(response.content)
            for item in root.findall(".//item"):
                title = item.findtext("title", "").strip()
                link = item.findtext("link", "").strip()
                pub_date_str = item.findtext("pubDate", "")
                source = item.findtext("source", "News Source")

                if " - " in title and source == "News Source":
                    parts = title.rsplit(" - ", 1)
                    title = parts[0]
                    source = parts[1]

                items.append({
                    "title": title,
                    "link": link,
                    "source": source,
                    "published_dt": None,
                    "published": pub_date_str or "Recent",
                    "query": query
                })

    except Exception as e:
        logger.error(f"Error fetching feed for '{query}': {e}")

    return items

def get_recent_gujarat_startup_news() -> List[Dict]:
    """
    Fetch news from all predefined Gujarat startup queries,
    filter to last 24h, and eliminate duplicates.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    cutoff_time = now - datetime.timedelta(hours=NEWS_LOOKBACK_HOURS)

    seen_in_batch = set()
    candidate_news = []

    logger.info("Scanning Gujarat Startup & Policy RSS feeds...")

    for query in RSS_QUERIES:
        feed_items = fetch_rss_feed(query)
        for item in feed_items:
            title = item["title"]
            link = item["link"]

            # Local memory deduplication across search terms
            normalized_key = title.lower()[:60]
            if normalized_key in seen_in_batch:
                continue
            seen_in_batch.add(normalized_key)

            # Check SQLite persistent store
            if is_duplicate(title, link):
                continue

            # Time filtering (if datetime was parsed)
            if item["published_dt"] and item["published_dt"] < cutoff_time:
                continue

            candidate_news.append(item)

    logger.info(f"Found {len(candidate_news)} fresh, non-duplicate news items.")
    return candidate_news[:MAX_NEWS_ITEMS]
