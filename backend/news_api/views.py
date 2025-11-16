from django.http import JsonResponse
import requests
import xml.etree.ElementTree as ET
from datetime import datetime

def get_ratopati_politics(request):
    """
    Fetch all politics-related news from Ratopati RSS feed
    Returns: heading, description, image, category, link, publication date, and more
    """
    rss_url = "https://www.ratopati.com/feed"
    
    try:
        response = requests.get(rss_url, timeout=10)
        response.raise_for_status()
        
        # Register namespaces to handle media and other XML namespaces
        namespaces = {
            'content': 'http://purl.org/rss/1.0/modules/content/',
            'media': 'http://search.yahoo.com/mrss/',
            'atom': 'http://www.w3.org/2005/Atom'
        }
        
        root = ET.fromstring(response.content)
        news_items = []
        
        for item in root.findall(".//item"):
            try:
                # Extract basic information
                title_elem = item.find("title")
                link_elem = item.find("link")
                description_elem = item.find("description")
                pub_date_elem = item.find("pubDate")
                category_elem = item.find("category")
                
                title = title_elem.text if title_elem is not None else "N/A"
                link = link_elem.text if link_elem is not None else "N/A"
                description = description_elem.text if description_elem is not None else "N/A"
                pub_date = pub_date_elem.text if pub_date_elem is not None else "N/A"
                category = category_elem.text if category_elem is not None else "N/A"
                
                # Check if article is politics-related
                is_politics = (
                    "politics" in category.lower() or 
                    "political" in category.lower() or
                    "राजनीति" in (title or "") or 
                    "राजनीति" in (description or "") or
                    "राजनीतिक" in (title or "") or
                    "राजनीतिक" in (description or "")
                )
                
                if not is_politics:
                    continue
                
                # Extract image from media:content or media:thumbnail
                image_url = None
                
                # Try media:content
                media_content = item.find("media:content", namespaces)
                if media_content is not None:
                    image_url = media_content.get("url")
                
                # Try media:thumbnail if media:content not found
                if not image_url:
                    media_thumbnail = item.find("media:thumbnail", namespaces)
                    if media_thumbnail is not None:
                        image_url = media_thumbnail.get("url")
                
                # Try enclosure tag
                if not image_url:
                    enclosure = item.find("enclosure")
                    if enclosure is not None:
                        image_url = enclosure.get("url")
                
                # Extract author/source
                author_elem = item.find("author")
                author = author_elem.text if author_elem is not None else "Ratopati"
                
                # Extract guid (unique identifier)
                guid_elem = item.find("guid")
                guid = guid_elem.text if guid_elem is not None else link
                
                # Build news item with all available data
                news_item = {
                    "title": title,
                    "heading": title,  # Alias for title
                    "description": description,
                    "image": image_url,
                    "image_url": image_url,  # Alias for image
                    "link": link,
                    "category": category,
                    "pub_date": pub_date,
                    "published_date": pub_date,  # Alias
                    "author": author,
                    "source": "Ratopati",
                    "guid": guid,
                    "content_type": "politics"
                }
                
                news_items.append(news_item)
                
            except Exception as item_error:
                # Log error but continue processing other items
                print(f"Error processing item: {str(item_error)}")
                continue
        
        # Sort by publication date (newest first)
        try:
            news_items.sort(
                key=lambda x: datetime.strptime(x['pub_date'], '%a, %d %b %Y %H:%M:%S %z') 
                if x['pub_date'] != "N/A" else datetime.min,
                reverse=True
            )
        except:
            pass  # If sorting fails, keep original order
        
        response_data = {
            "status": "success",
            "total_articles": len(news_items),
            "source": "Ratopati RSS Feed",
            "data": news_items
        }
        
        return JsonResponse(response_data, safe=False)
        
    except requests.exceptions.RequestException as req_error:
        return JsonResponse({
            "status": "error",
            "error": f"Request error: {str(req_error)}"
        }, status=500)
    except ET.ParseError as parse_error:
        return JsonResponse({
            "status": "error",
            "error": f"XML parsing error: {str(parse_error)}"
        }, status=500)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "error": str(e)
        }, status=500)