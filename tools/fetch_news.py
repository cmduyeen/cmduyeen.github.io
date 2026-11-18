"""Generate a weekly draft issue in content/news/YYYY-wWW.md from curated RSS feeds.

Usage (from repo root):
    py -3 tools/fetch_news.py
"""

from __future__ import annotations

import datetime as dt
import html
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

FEEDS = [
    ("Hacker News", "https://hnrss.org/frontpage?points=150"),
    ("GitHub Blog", "https://github.blog/feed/"),
    ("Simon Willison (AI)", "https://simonwillison.net/atom/everything/"),
]

ROOT = Path(__file__).resolve().parent.parent
NEWS_DIR = ROOT / "content" / "news"


def clean_text(raw: str) -> str:
    text = re.sub(r"<[^>]+>", "", html.unescape(raw or ""))
    return re.sub(r"\s+", " ", text).strip()


def fetch_feed(name: str, url: str, limit: int = 4) -> list[tuple[str, str, str]]:
    req = urllib.request.Request(url, headers={"User-Agent": "dyn-news-bot/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
    root = ET.fromstring(data)
    items: list[tuple[str, str, str]] = []

    # RSS 2.0
    for item in root.findall(".//item")[:limit]:
        title = clean_text(item.findtext("title") or "")
        link = (item.findtext("link") or "").strip()
        if title and link:
            items.append((name, title, link))

    # Atom fallback
    if not items:
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        for entry in root.findall(".//atom:entry", ns)[:limit]:
            title = clean_text(entry.findtext("atom:title", default="", namespaces=ns))
            link_el = entry.find("atom:link", ns)
            link = link_el.attrib.get("href", "").strip() if link_el is not None else ""
            if title and link:
                items.append((name, title, link))

    return items


def main() -> None:
    now = dt.datetime.now(dt.timezone.utc)
    iso_year, iso_week, _ = now.isocalendar()
    slug = f"{iso_year}-w{iso_week:02d}"
    out_file = NEWS_DIR / f"{slug}.md"

    if out_file.exists():
        print(f"Draft already exists: {out_file}")
        return

    collected: list[tuple[str, str, str]] = []
    for source, url in FEEDS:
        try:
            collected.extend(fetch_feed(source, url, limit=3))
        except Exception as exc:
            print(f"[warn] Failed to fetch {source}: {exc}")

    lines = [
        "---",
        f'title: "Tech Digest #{iso_year}-W{iso_week:02d}: Weekly Signal"',
        f"date: {now.strftime('%Y-%m-%dT%H:%M:%SZ')}",
        'description: "Curated updates on AI tooling, web engineering, and automation."',
        'tags: ["ai-tools", "automation", "dev-web"]',
        "draft: true",
        "---",
        "",
        "### ⚡ Top Shifts",
    ]
    for source, title, link in collected[:5]:
        lines.append(f"- **[{title}]({link})** *({source})*")

    lines.extend([
        "",
        "<!--more-->",
        "",
        "### 🛠 Tools & Releases",
        "- Add 1–2 notable tool releases here.",
        "",
        "### 🎯 Dyn's Take",
        "- Add a 1-sentence practical takeaway and link to [/learn/](/learn/) or [/tools/](/tools/).",
        "",
    ])

    NEWS_DIR.mkdir(parents=True, exist_ok=True)
    out_file.write_text("\n".join(lines), encoding="utf-8")
    print(f"Created draft: {out_file} ({len(collected)} items fetched)")


if __name__ == "__main__":
    main()
