from datetime import datetime

import feedparser

POLITICS_KEYWORDS = [
    "politics",
    "political",
    "government",
    "election",
    "राजनीति",
    "नेता",
    "संसद",
    "मन्त्री",
    "प्रधानमन्त्री",
    "दल",
    "कांग्रेस",
    "एमाले",
    "माओवादी",
    "सरकार",
]

NEWS_SOURCES = {
    "onlinekhabar": "https://www.onlinekhabar.com/feed",
    "setopati": "https://www.setopati.com/rss",
    "ratopati": "https://www.ratopati.com/rss",
    "bbCnepali": "http://feeds.bbci.co.uk/nepali/rss.xml",
    "kantipur": "https://ekantipur.com/rss",
    "nagarik": "https://nagariknews.nagariknetwork.com/rss",
}


def is_politics(text: str) -> bool:
    text = text.lower()
    return any(keyword.lower() in text for keyword in POLITICS_KEYWORDS)


def parse_date(entry):
    pub_date = entry.get("published", None)
    if not pub_date:
        return None

    try:
        return datetime(*entry.published_parsed[:6]).isoformat()
    except:
        return None


def extract_image(entry):
    """Extract image URL if available (media:content, enclosure)"""
    image_url = None

    try:
        if "media_content" in entry:
            return entry.media_content[0]["url"]

        if "media_thumbnail" in entry:
            return entry.media_thumbnail[0]["url"]

        if "links" in entry:
            for link in entry.links:
                if link.get("type", "").startswith("image"):
                    return link["href"]

    except:
        return None

    return image_url


def scrape_source(name: str, url: str):
    feed = feedparser.parse(url)
    results = []

    for entry in feed.entries:
        text = f"{entry.title} {entry.get('summary', '')}"

        # Filter politics content
        if not is_politics(text):
            continue

        item = {
            "source_name": name,
            "title": entry.title,
            "heading": entry.title,
            "description": entry.get("summary", ""),
            "link": entry.link,
            "category": entry.get("category", ""),
            "author": entry.get("author", name),
            "pub_date": entry.get("published", None),
            "published_date": entry.get("published", None),
            "parsed_date": parse_date(entry),
            "guid": entry.get("id", entry.link),
            "image": extract_image(entry),
            "image_url": extract_image(entry),
            "content_type": "politics",
        }

        results.append(item)

    return results


def scrape_all_sources():
    all_news = []

    for name, url in NEWS_SOURCES.items():
        try:
            source_news = scrape_source(name, url)
            all_news.extend(source_news)
        except Exception as e:
            all_news.append({"source_name": name, "error": str(e)})

    all_news = sorted(all_news, key=lambda x: x.get("parsed_date", ""), reverse=True)

    return all_news
