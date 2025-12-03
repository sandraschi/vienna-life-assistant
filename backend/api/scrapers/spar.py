"""
Spar.at Web Scraper
Scrapes weekly offers from Spar Austria
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any
import httpx
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)


class SparScraper:
    """Scraper for Spar.at weekly offers"""
    
    BASE_URL = "https://www.spar.at"
    OFFERS_URL = f"{BASE_URL}/angebote"
    
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    
    async def scrape_offers(self) -> List[Dict[str, Any]]:
        """
        Scrape current weekly offers from Spar
        
        Returns:
            List of offer dictionaries with product info
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.OFFERS_URL, headers=self.headers)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                offers = []
                
                # Parse offers (structure may need adjustment based on actual site)
                offer_cards = soup.find_all('div', class_=['product-card', 'offer-card'])
                
                for card in offer_cards[:50]:  # Limit to 50 offers
                    try:
                        offer = self._parse_offer_card(card)
                        if offer:
                            offers.append(offer)
                    except Exception as e:
                        logger.warning(f"Failed to parse offer card: {e}")
                        continue
                
                logger.info(f"Scraped {len(offers)} offers from Spar")
                return offers
                
        except Exception as e:
            logger.error(f"Failed to scrape Spar offers: {e}")
            return []
    
    def _parse_offer_card(self, card) -> Dict[str, Any]:
        """Parse individual offer card"""
        
        # Extract product name
        name_elem = card.find(['h3', 'h4', 'span'], class_=['product-name', 'title'])
        product_name = name_elem.get_text(strip=True) if name_elem else "Unknown Product"
        
        # Extract prices
        price_elem = card.find('span', class_=['price', 'offer-price'])
        price_text = price_elem.get_text(strip=True) if price_elem else "0"
        
        # Parse price (remove currency symbols, convert to float)
        try:
            price = float(''.join(filter(str.isdigit, price_text.replace(',', '.')))) / 100
        except:
            price = 0.0
        
        # Extract original price if available
        original_price_elem = card.find('span', class_=['original-price', 'old-price'])
        original_price = None
        if original_price_elem:
            try:
                original_price = float(''.join(filter(str.isdigit, original_price_elem.get_text().replace(',', '.')))) / 100
            except:
                pass
        
        # Calculate discount percentage
        discount_percentage = 0
        if original_price and original_price > price:
            discount_percentage = int(((original_price - price) / original_price) * 100)
        
        # Extract image
        img_elem = card.find('img')
        image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
        if image_url and not image_url.startswith('http'):
            image_url = f"{self.BASE_URL}{image_url}"
        
        # Extract category
        category_elem = card.find('span', class_=['category', 'product-category'])
        category = category_elem.get_text(strip=True) if category_elem else "General"
        
        # Set validity dates (typically current week)
        today = datetime.now().date()
        valid_from = today - timedelta(days=today.weekday())  # Start of week (Monday)
        valid_until = valid_from + timedelta(days=6)  # End of week (Sunday)
        
        return {
            "store": "spar",
            "product_name": product_name,
            "discounted_price": price,
            "original_price": original_price,
            "discount_percentage": discount_percentage,
            "category": category,
            "image_url": image_url,
            "valid_from": valid_from,
            "valid_until": valid_until,
        }
    
    async def get_mock_offers(self) -> List[Dict[str, Any]]:
        """
        Get mock offers for testing (when scraping fails or for development)
        """
        today = datetime.now().date()
        valid_from = today - timedelta(days=today.weekday())
        valid_until = valid_from + timedelta(days=6)
        
        return [
            {
                "store": "spar",
                "product_name": "Jacobs Krönung Kaffee 500g",
                "discounted_price": 4.99,
                "original_price": 6.99,
                "discount_percentage": 29,
                "category": "Getränke",
                "image_url": None,
                "valid_from": valid_from,
                "valid_until": valid_until,
            },
            {
                "store": "spar",
                "product_name": "Milka Schokolade 100g",
                "discounted_price": 0.99,
                "original_price": 1.49,
                "discount_percentage": 34,
                "category": "Süßwaren",
                "image_url": None,
                "valid_from": valid_from,
                "valid_until": valid_until,
            },
            {
                "store": "spar",
                "product_name": "Spar Premium Butter 250g",
                "discounted_price": 1.99,
                "original_price": 2.49,
                "discount_percentage": 20,
                "category": "Milchprodukte",
                "image_url": None,
                "valid_from": valid_from,
                "valid_until": valid_until,
            },
            {
                "store": "spar",
                "product_name": "Coca-Cola 1.5L",
                "discounted_price": 1.29,
                "original_price": 1.79,
                "discount_percentage": 28,
                "category": "Getränke",
                "image_url": None,
                "valid_from": valid_from,
                "valid_until": valid_until,
            },
            {
                "store": "spar",
                "product_name": "Spar Natur*pur Bio Eier 6 Stück",
                "discounted_price": 2.49,
                "original_price": 2.99,
                "discount_percentage": 17,
                "category": "Eier",
                "image_url": None,
                "valid_from": valid_from,
                "valid_until": valid_until,
            },
        ]

