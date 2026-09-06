import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging
from typing import List, Dict
import requests
import datetime

try:
    from .config import (
        ENABLE_TELEGRAM, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
        ENABLE_EMAIL, SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
        EMAIL_FROM, EMAIL_TO
    )
except ImportError:
    from config import (
        ENABLE_TELEGRAM, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
        ENABLE_EMAIL, SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
        EMAIL_FROM, EMAIL_TO
    )

logger = logging.getLogger(__name__)

def format_telegram_message(items: List[Dict]) -> str:
    """Format news digest for Telegram message using HTML formatting."""
    today_str = datetime.date.today().strftime("%B %d, %Y")
    
    msg_lines = [
        f"🚀 <b>GUJARAT STARTUP & POLICY INTEL</b>",
        f"📅 <i>Daily Executive Digest • {today_str}</i>",
        f"━━━━━━━━━━━━━━━━━━━━━\n"
    ]

    if not items:
        msg_lines.append("<i>No new major policy announcements or startup articles detected in the last 24 hours.</i>")
        return "\n".join(msg_lines)

    for i, item in enumerate(items, 1):
        title = item["title"]
        source = item.get("source", "Official Source")
        link = item["link"]
        query_tag = item.get("query", "Policy")

        msg_lines.append(
            f"<b>{i}. {title}</b>\n"
            f"🏷️ <i>{source}</i> • <code>#{query_tag.replace(' ', '')}</code>\n"
            f"🔗 <a href='{link}'>Read Full Report</a>\n"
        )

    msg_lines.append("━━━━━━━━━━━━━━━━━━━━━")
    msg_lines.append("💡 <i>Coverage: i-Hub, GUSEC, SSIP 2.0, iCreate, Startup Gujarat</i>")
    return "\n".join(msg_lines)

def send_telegram_alert(items: List[Dict]) -> bool:
    """Send notification to user/channel via Telegram Bot API."""
    if not ENABLE_TELEGRAM:
        logger.info("Telegram notification is disabled in config.")
        return False

    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Telegram Bot Token or Chat ID is missing.")
        return False

    text_message = format_telegram_message(items)
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text_message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        res_data = response.json()
        if res_data.get("ok"):
            logger.info("Telegram digest sent successfully!")
            return True
        else:
            logger.error(f"Telegram API Error: {res_data}")
            return False
    except Exception as e:
        logger.error(f"Failed to send Telegram message: {e}")
        return False

def format_email_html(items: List[Dict]) -> str:
    """Generate responsive, executive HTML email newsletter."""
    today_str = datetime.date.today().strftime("%d %b %Y")
    
    items_html = ""
    for i, item in enumerate(items, 1):
        items_html += f"""
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
                Update {i:02d} • {item.get('source', 'News Source')}
            </div>
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 10px;">
                {item['title']}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 10px; margin-top: 6px;">
                <span style="font-size: 12px; color: #64748b; font-weight: 500;">
                    Sector: {item.get('query', 'Gujarat Ecosystem')}
                </span>
                <a href="{item['link']}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700;">
                    Read Article &rarr;
                </a>
            </div>
        </div>
        """

    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Gujarat Startup & Policy Intel</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #f8fafc;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 28px 24px; color: white; margin-bottom: 24px; text-align: left;">
                <div style="display: inline-block; background: #2563eb; color: #ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.1em; margin-bottom: 12px;">
                    DAILY ECOSYSTEM INTELLIGENCE
                </div>
                <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em;">
                    Gujarat Startup & Policy Digest
                </h1>
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                    Automated briefing on SSIP 2.0, i-Hub, GUSEC, iCreate, and policy directives &bull; {today_str}
                </p>
            </div>

            <!-- News List -->
            {items_html if items else '<p style="text-align: center; color: #64748b; padding: 40px 0;">No new updates detected in the last 24 hours.</p>'}

            <!-- Footer -->
            <div style="text-align: center; padding: 20px 10px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 24px;">
                This automated briefing was generated by your Gujarat Startup News Watcher.<br>
                Runs daily at 8:00 AM IST via background Cron / GitHub Actions.
            </div>
        </div>
    </body>
    </html>
    """
    return html_template

def send_email_alert(items: List[Dict]) -> bool:
    """Send HTML newsletter digest via SMTP."""
    if not ENABLE_EMAIL:
        logger.info("Email notification is disabled in config.")
        return False

    if not SMTP_USER or not SMTP_PASSWORD or not EMAIL_TO:
        logger.warning("SMTP configuration is incomplete. Skipping email.")
        return False

    today_str = datetime.date.today().strftime("%d %b %Y")
    subject = f"🚀 Gujarat Startup & Policy Briefing • {today_str} ({len(items)} updates)"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = EMAIL_FROM
    msg["To"] = EMAIL_TO

    # Plain text summary
    plain_text = f"Gujarat Startup Daily Digest - {today_str}\n\n"
    for i, item in enumerate(items, 1):
        plain_text += f"{i}. {item['title']}\nSource: {item['source']}\nLink: {item['link']}\n\n"

    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(format_email_html(items), "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        recipients = [e.strip() for e in EMAIL_TO.split(",") if e.strip()]
        server.sendmail(EMAIL_FROM, recipients, msg.as_string())
        server.quit()
        logger.info(f"Email digest sent successfully to {recipients}!")
        return True
    except Exception as e:
        logger.error(f"Failed to send email alert: {e}")
        return False
