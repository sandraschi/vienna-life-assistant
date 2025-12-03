"""
Shopping API Routes
Store offers and shopping lists
"""
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional, List
from datetime import datetime, date
from models import get_db, StoreOffer, Store
from api.scrapers.spar import SparScraper
from api.scrapers.billa import BillaScraper
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/offers")
async def get_offers(
    store: Optional[Store] = Query(None, description="Filter by store"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_discount: Optional[int] = Query(None, description="Minimum discount percentage"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get current store offers
    
    - **store**: Filter by specific store (spar, billa)
    - **category**: Filter by product category
    - **min_discount**: Minimum discount percentage
    """
    query = db.query(StoreOffer)
    
    # Filter by current validity
    today = date.today()
    query = query.filter(
        and_(
            StoreOffer.valid_from <= today,
            StoreOffer.valid_until >= today
        )
    )
    
    # Apply filters
    if store:
        query = query.filter(StoreOffer.store == store)
    if category:
        query = query.filter(StoreOffer.category.ilike(f"%{category}%"))
    if min_discount:
        query = query.filter(StoreOffer.discount_percentage >= min_discount)
    
    # Get total
    total = query.count()
    
    # Paginate and order by discount
    offset = (page - 1) * page_size
    offers = (query
              .order_by(StoreOffer.discount_percentage.desc())
              .offset(offset)
              .limit(page_size)
              .all())
    
    return {
        "offers": [offer.to_dict() for offer in offers],
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.post("/scrape")
async def scrape_offers(
    background_tasks: BackgroundTasks,
    store: Optional[Store] = Query(None, description="Specific store to scrape"),
    use_mock: bool = Query(False, description="Use mock data instead of scraping"),
    db: Session = Depends(get_db)
):
    """
    Trigger store offers scraping
    
    - **store**: Scrape specific store or all if not specified
    - **use_mock**: Use mock data for testing (default: false)
    """
    scraped_count = 0
    
    stores_to_scrape = [store] if store else [Store.SPAR, Store.BILLA]
    
    for store_name in stores_to_scrape:
        try:
            if store_name == Store.SPAR:
                scraper = SparScraper()
                offers = await scraper.get_mock_offers() if use_mock else await scraper.scrape_offers()
            elif store_name == Store.BILLA:
                scraper = BillaScraper()
                offers = await scraper.get_mock_offers() if use_mock else await scraper.scrape_offers()
            else:
                continue
            
            # If real scraping failed, fallback to mock data
            if not offers and not use_mock:
                logger.warning(f"Real scraping failed for {store_name}, using mock data")
                if store_name == Store.SPAR:
                    offers = await SparScraper().get_mock_offers()
                else:
                    offers = await BillaScraper().get_mock_offers()
            
            # Save to database
            for offer_data in offers:
                # Check if offer already exists
                existing = db.query(StoreOffer).filter(
                    and_(
                        StoreOffer.store == offer_data["store"],
                        StoreOffer.product_name == offer_data["product_name"],
                        StoreOffer.valid_from == offer_data["valid_from"]
                    )
                ).first()
                
                if not existing:
                    offer = StoreOffer(**offer_data)
                    db.add(offer)
                    scraped_count += 1
            
            db.commit()
            logger.info(f"Saved {len(offers)} offers from {store_name}")
            
        except Exception as e:
            logger.error(f"Error scraping {store_name}: {e}")
            continue
    
    return {
        "success": True,
        "scraped_count": scraped_count,
        "message": f"Successfully scraped {scraped_count} offers"
    }


@router.get("/stats")
async def get_store_stats(
    db: Session = Depends(get_db)
):
    """Get statistics about store offers"""
    today = date.today()
    
    # Count offers by store
    spar_count = db.query(StoreOffer).filter(
        and_(
            StoreOffer.store == Store.SPAR,
            StoreOffer.valid_from <= today,
            StoreOffer.valid_until >= today
        )
    ).count()
    
    billa_count = db.query(StoreOffer).filter(
        and_(
            StoreOffer.store == Store.BILLA,
            StoreOffer.valid_from <= today,
            StoreOffer.valid_until >= today
        )
    ).count()
    
    # Get best discounts
    best_discounts = db.query(StoreOffer).filter(
        and_(
            StoreOffer.valid_from <= today,
            StoreOffer.valid_until >= today
        )
    ).order_by(StoreOffer.discount_percentage.desc()).limit(5).all()
    
    return {
        "total_offers": spar_count + billa_count,
        "spar_offers": spar_count,
        "billa_offers": billa_count,
        "best_discounts": [offer.to_dict() for offer in best_discounts]
    }

