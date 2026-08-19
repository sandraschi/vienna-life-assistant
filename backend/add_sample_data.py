"""Add sample todos and data to database"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from models.base import SessionLocal
from models.todo import TodoItem
from models.shopping import StoreOffer
from datetime import date, timedelta

print("🔧 Adding sample data to database...")

db = SessionLocal()

try:
    # Add sample todos
    todos = [
        TodoItem(
            title="Buy condiments at Spar",
            description="Ketchup, mustard, mayo",
            priority="normal",
            category="Shopping"
        ),
        TodoItem(
            title="Vet appointment - Benny",
            description="Annual checkup and vaccines",
            priority="urgent",
            category="Benny"
        ),
        TodoItem(
            title="Wash hair",
            description="Use the good shampoo",
            priority="normal",
            category="Self-care"
        ),
        TodoItem(
            title="Buy Manner Schnitten",
            description="From Billa",
            priority="normal",
            category="Shopping"
        ),
        TodoItem(
            title="Walk Benny in park",
            description="Morning walk",
            priority="normal",
            category="Benny"
        ),
    ]
    
    for todo in todos:
        db.add(todo)
    
    db.commit()
    print(f"✅ Added {len(todos)} sample todos")
    
    # Add sample shopping offers
    today = date.today()
    valid_from = today - timedelta(days=today.weekday())
    valid_until = valid_from + timedelta(days=6)
    
    offers = [
        StoreOffer(
            store="spar",
            product_name="Jacobs Krönung Kaffee 500g",
            discounted_price=4.99,
            original_price=6.99,
            discount_percentage=29,
            category="Getränke",
            valid_from=valid_from,
            valid_until=valid_until
        ),
        StoreOffer(
            store="billa",
            product_name="Ja! Natürlich Bio Milch 1L",
            discounted_price=1.29,
            original_price=1.69,
            discount_percentage=24,
            category="Milchprodukte",
            valid_from=valid_from,
            valid_until=valid_until
        ),
    ]
    
    for offer in offers:
        db.add(offer)
    
    db.commit()
    print(f"✅ Added {len(offers)} sample offers")
    
    # Count total
    total_todos = db.query(TodoItem).count()
    total_offers = db.query(StoreOffer).count()
    
    print("\n📊 Database now has:")
    print(f"   Todos: {total_todos}")
    print(f"   Offers: {total_offers}")
    print("\n✅ Sample data added successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()


