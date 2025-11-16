import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.cache import cache
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
from functools import wraps

logger = logging.getLogger(__name__)

# Configuration
RSS_URL = "https://www.onlinekhabar.com/feed"
REQUEST_TIMEOUT = 10
CACHE_DURATION = 3600  # 1 hour
MAX_ARTICLES = 100

NAMESPACES = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'media': 'http://search.yahoo.com/mrss/',
    'atom': 'http://www.w3.org/2005/Atom'
}

POLITICS_KEYWORDS = {
    'en': ['politics', 'political', 'election', 'parliament', 'government'],
    'ne': ['राजनीति', 'राजनीतिक', 'चुनाव', 'संसद', 'सरकार']
}


def handle_errors(f):
    """Decorator for consistent error handling"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except requests.exceptions.Timeout:
            logger.error("RSS feed request timed out")
            return JsonResponse({
                "status": "error",
                "error": "Request timeout - RSS feed is taking too long to respond"
            }, status=504)
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return JsonResponse({
                "status": "error",
                "error": "Failed to fetch RSS feed"
            }, status=503)
        except ET.ParseError as e:
            logger.error(f"XML parsing error: {str(e)}")
            return JsonResponse({
                "status": "error",
                "error": "Invalid RSS feed format"
            }, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return JsonResponse({
                "status": "error",
                "error": "Internal server error"
            }, status=500)
    return wrapper


def is_politics_related(title, description, category):
    """Check if article is politics-related using keywords"""
    text = f"{title} {description} {category}".lower()
    
    # Check English keywords
    if any(keyword in text for keyword in POLITICS_KEYWORDS['en']):
        return True
    
    # Check Nepali keywords
    if any(keyword in text for keyword in POLITICS_KEYWORDS['ne']):
        return True
    
    return False


def extract_image_url(item, namespaces):
    """Extract image URL from various possible sources"""
    # Try media:content
    media_content = item.find("media:content", namespaces)
    if media_content is not None:
        url = media_content.get("url")
        if url:
            return url
    
    # Try media:thumbnail
    media_thumbnail = item.find("media:thumbnail", namespaces)
    if media_thumbnail is not None:
        url = media_thumbnail.get("url")
        if url:
            return url
    
    # Try enclosure tag
    enclosure = item.find("enclosure")
    if enclosure is not None:
        url = enclosure.get("url")
        if url:
            return url
    
    return None


def safe_get_element_text(element, tag, namespaces=None):
    """Safely extract text from XML element"""
    if element is None:
        return "N/A"
    
    elem = element.find(tag, namespaces) if namespaces else element.find(tag)
    return elem.text if elem is not None and elem.text else "N/A"


def parse_publication_date(pub_date_str):
    """Parse publication date and handle errors gracefully"""
    if pub_date_str == "N/A":
        return datetime.now()
    
    try:
        return datetime.strptime(pub_date_str, '%a, %d %b %Y %H:%M:%S %z')
    except ValueError:
        logger.warning(f"Could not parse date: {pub_date_str}")
        return datetime.now()


def build_news_item(item, namespaces):
    """Build a news item from RSS item element"""
    try:
        title = safe_get_element_text(item, "title")
        link = safe_get_element_text(item, "link")
        description = safe_get_element_text(item, "description")
        pub_date = safe_get_element_text(item, "pubDate")
        category = safe_get_element_text(item, "category")
        
        # Check if politics-related
        if not is_politics_related(title, description, category):
            return None
        
        author_elem = item.find("author")
        author = author_elem.text if author_elem is not None else "OnlineKhabar"
        
        guid_elem = item.find("guid")
        guid = guid_elem.text if guid_elem is not None else link
        
        image_url = extract_image_url(item, namespaces)
        
        return {
            "title": title,
            "heading": title,
            "description": description,
            "image": image_url,
            "image_url": image_url,
            "link": link,
            "category": category,
            "pub_date": pub_date,
            "published_date": pub_date,
            "author": author,
            "source": "OnlineKhabar",
            "guid": guid,
            "content_type": "politics",
            "parsed_date": parse_publication_date(pub_date).isoformat()
        }
    except Exception as e:
        logger.warning(f"Error processing RSS item: {str(e)}")
        return None


def fetch_and_parse_rss():
    """Fetch and parse RSS feed, return list of news items"""
    response = requests.get(RSS_URL, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    
    root = ET.fromstring(response.content)
    news_items = []
    
    for item in root.findall(".//item"):
        news_item = build_news_item(item, NAMESPACES)
        if news_item:
            news_items.append(news_item)
        
        # Limit to MAX_ARTICLES
        if len(news_items) >= MAX_ARTICLES:
            break
    
    return news_items


def sort_news_items(news_items):
    """Sort news items by publication date (newest first)"""
    try:
        return sorted(
            news_items,
            key=lambda x: datetime.fromisoformat(x['parsed_date']),
            reverse=True
        )
    except Exception as e:
        logger.warning(f"Error sorting news items: {str(e)}")
        return news_items


@require_http_methods(["GET"])
@handle_errors
def get_ratopati_politics(request):
    """
    Fetch politics-related news from OnlineKhabar RSS feed
    
    Query Parameters:
        - cache: 'true'/'false' to control caching (default: true)
    
    Returns:
        - status: 'success' or 'error'
        - total_articles: number of articles
        - data: list of news items
    """
    # Check cache first
    use_cache = request.GET.get('cache', 'true').lower() != 'false'
    cache_key = 'politics_news_rss'
    
    if use_cache:
        cached_data = cache.get(cache_key)
        if cached_data:
            return JsonResponse({
                "status": "success",
                "total_articles": len(cached_data),
                "source": "OnlineKhabar RSS Feed",
                "cached": True,
                "data": cached_data
            })
    
    # Fetch fresh data
    news_items = fetch_and_parse_rss()
    news_items = sort_news_items(news_items)
    
    # Cache the results
    if use_cache:
        cache.set(cache_key, news_items, CACHE_DURATION)
    
    return JsonResponse({
        "status": "success",
        "total_articles": len(news_items),
        "source": "OnlineKhabar RSS Feed",
        "cached": False,
        "data": news_items
    })