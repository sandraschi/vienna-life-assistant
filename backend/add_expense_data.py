"""Add sample expenses to database"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from models.base import SessionLocal
from models.expense import Expense
from datetime import date, timedelta
from decimal import Decimal

print("💰 Adding sample expenses...")

db = SessionLocal()

try:
    # Base dates
    today = date.today()
    
    # Sample expenses from the past 30 days
    expenses = [
        # Groceries
        Expense(
            date=today - timedelta(days=1),
            amount=Decimal("67.45"),
            category="groceries",
            store="Spar",
            description="Weekly grocery shopping",
            tags=["weekly", "food"]
        ),
        Expense(
            date=today - timedelta(days=3),
            amount=Decimal("23.80"),
            category="groceries",
            store="Billa",
            description="Manner Schnitten and snacks",
            tags=["snacks"]
        ),
        Expense(
            date=today - timedelta(days=7),
            amount=Decimal("89.30"),
            category="groceries",
            store="Spar",
            description="Weekly grocery shopping",
            tags=["weekly", "food"]
        ),
        Expense(
            date=today - timedelta(days=14),
            amount=Decimal("102.15"),
            category="groceries",
            store="Billa",
            description="Bi-weekly grocery run",
            tags=["weekly", "food"]
        ),
        
        # Benny/Pet expenses
        Expense(
            date=today - timedelta(days=2),
            amount=Decimal("45.00"),
            category="pet",
            store="Fressnapf",
            description="Benny's dog food and treats",
            tags=["benny", "food"]
        ),
        Expense(
            date=today - timedelta(days=10),
            amount=Decimal("85.00"),
            category="pet",
            store="Tierarzt Dr. Müller",
            description="Benny checkup",
            tags=["benny", "veterinary"]
        ),
        Expense(
            date=today - timedelta(days=15),
            amount=Decimal("35.00"),
            category="pet",
            store="Hundepflege Wien",
            description="Benny grooming",
            tags=["benny", "grooming"]
        ),
        
        # Personal care
        Expense(
            date=today - timedelta(days=5),
            amount=Decimal("42.00"),
            category="personal",
            store="dm drogerie markt",
            description="Shampoo and personal care items",
            tags=["self-care"]
        ),
        Expense(
            date=today - timedelta(days=12),
            amount=Decimal("55.00"),
            category="personal",
            store="Friseur Stroheck",
            description="Haircut",
            tags=["self-care", "appointment"]
        ),
        
        # Household
        Expense(
            date=today - timedelta(days=8),
            amount=Decimal("28.50"),
            category="household",
            store="dm drogerie markt",
            description="Cleaning supplies",
            tags=["cleaning"]
        ),
        Expense(
            date=today - timedelta(days=20),
            amount=Decimal("156.00"),
            category="household",
            store="IKEA",
            description="Kitchen organizers",
            tags=["furniture", "organization"]
        ),
        
        # Transport
        Expense(
            date=today - timedelta(days=4),
            amount=Decimal("51.00"),
            category="transport",
            store="Wiener Linien",
            description="Monthly transit pass",
            tags=["public-transport", "monthly"]
        ),
        Expense(
            date=today - timedelta(days=18),
            amount=Decimal("12.50"),
            category="transport",
            store="ÖBB",
            description="Train to Hollabrunn",
            tags=["visit", "marion"]
        ),
        
        # Health
        Expense(
            date=today - timedelta(days=6),
            amount=Decimal("24.90"),
            category="health",
            store="Apotheke",
            description="Vitamins and supplements",
            tags=["health", "vitamins"]
        ),
        
        # Miscellaneous
        Expense(
            date=today - timedelta(days=9),
            amount=Decimal("18.50"),
            category="other",
            store="Café Landtmann",
            description="Coffee with Marion",
            tags=["social", "coffee"]
        ),
    ]
    
    for expense in expenses:
        db.add(expense)
    
    db.commit()
    print(f"✅ Added {len(expenses)} sample expenses")
    
    # Calculate and display statistics
    total_expenses = db.query(Expense).count()
    from sqlalchemy import func
    total_amount = db.query(func.sum(Expense.amount)).scalar() or 0
    
    # By category
    print(f"\n📊 Database now has:")
    print(f"   Total expenses: {total_expenses}")
    print(f"   Total amount: €{float(total_amount):.2f}")
    
    print(f"\n💶 By Category:")
    category_stats = db.query(
        Expense.category,
        func.sum(Expense.amount),
        func.count(Expense.id)
    ).group_by(Expense.category).all()
    
    for cat, amount, count in category_stats:
        print(f"   • {cat}: €{float(amount):.2f} ({count} transactions)")
    
    print("\n✅ Expense data added successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

