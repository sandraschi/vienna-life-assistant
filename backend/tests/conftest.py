"""
Pytest configuration and fixtures
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from models.base import Base, get_db
from api.main import app
import tempfile
import os


@pytest.fixture(scope="function")
def test_db():
    """Create a test database for each test"""
    # Create temporary database file
    fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    
    # Create engine and tables
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
        poolclass=None  # Disable connection pooling for tests
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    db = TestingSessionLocal()
    yield db
    
    # Cleanup - close all connections before deleting
    db.close()
    engine.dispose()  # Close all connections in the pool
    app.dependency_overrides.clear()
    
    # Give Windows time to release file handles
    import time
    time.sleep(0.1)
    
    # Try to delete, but don't fail if we can't (Windows file locking)
    try:
        os.unlink(db_path)
    except PermissionError:
        # On Windows, file might still be locked - that's okay
        pass


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
def sample_todo_data():
    """Sample todo data for testing"""
    return {
        "title": "Test Todo",
        "description": "This is a test todo",
        "priority": "normal",
        "category": "Testing"
    }


@pytest.fixture
def sample_calendar_event_data():
    """Sample calendar event data for testing"""
    from datetime import datetime, timedelta
    start = datetime.now()
    end = start + timedelta(hours=1)
    
    return {
        "title": "Test Event",
        "description": "Test Description",
        "start_time": start.isoformat(),
        "end_time": end.isoformat(),
        "category": "personal",
        "color": "#1976D2"
    }


@pytest.fixture
def sample_shopping_offer():
    """Sample shopping offer data"""
    from datetime import date, timedelta
    today = date.today()
    
    return {
        "store": "spar",
        "product_name": "Test Product",
        "discounted_price": 1.99,
        "original_price": 2.99,
        "discount_percentage": 33,
        "category": "Test Category",
        "valid_from": today,
        "valid_until": today + timedelta(days=7)
    }

