"""
Test Shopping API endpoints
"""
import pytest


def test_get_offers_empty(client):
    """Test getting offers when none exist"""
    response = client.get("/api/shopping/offers")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] == 0
    assert data["offers"] == []


def test_scrape_with_mock(client):
    """Test scraping with mock data"""
    response = client.post("/api/shopping/scrape?use_mock=true")
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert data["scraped_count"] > 0


def test_get_offers_after_scrape(client):
    """Test getting offers after scraping"""
    # Scrape mock data
    client.post("/api/shopping/scrape?use_mock=true")
    
    # Get offers
    response = client.get("/api/shopping/offers")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] > 0
    assert len(data["offers"]) > 0


def test_filter_offers_by_store(client):
    """Test filtering offers by store"""
    # Scrape mock data
    client.post("/api/shopping/scrape?use_mock=true")
    
    # Filter by spar
    response = client.get("/api/shopping/offers?store=spar")
    assert response.status_code == 200
    
    data = response.json()
    if data["offers"]:
        assert all(offer["store"] == "spar" for offer in data["offers"])


def test_get_shopping_stats(client):
    """Test getting shopping statistics"""
    # Scrape mock data first
    client.post("/api/shopping/scrape?use_mock=true")
    
    response = client.get("/api/shopping/stats")
    assert response.status_code == 200
    
    data = response.json()
    assert "total_offers" in data
    assert "spar_offers" in data
    assert "billa_offers" in data

