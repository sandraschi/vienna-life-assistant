"""Add sample calendar events to database"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from models.base import SessionLocal
from models.calendar import CalendarEvent
from datetime import datetime, timedelta

print("📅 Adding sample calendar events...")

db = SessionLocal()

try:
    # Base dates for events
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Sample events
    events = [
        # Today
        CalendarEvent(
            title="Walk Benny in Volksgarten",
            description="Morning walk with Benny",
            start_time=today + timedelta(hours=8),
            end_time=today + timedelta(hours=9),
            category="benny",
            location="Volksgarten, 1090 Wien",
            color="#4CAF50"
        ),
        CalendarEvent(
            title="Shopping at Spar",
            description="Buy condiments and groceries",
            start_time=today + timedelta(hours=14),
            end_time=today + timedelta(hours=15),
            category="shopping",
            location="Spar, Stroheckgasse",
            color="#FF9800"
        ),
        
        # Tomorrow
        CalendarEvent(
            title="Vet Appointment - Benny",
            description="Annual checkup and vaccines",
            start_time=today + timedelta(days=1, hours=10),
            end_time=today + timedelta(days=1, hours=11),
            category="appointment",
            location="Tierarzt Dr. Müller, Alserbachstraße",
            color="#F44336"
        ),
        CalendarEvent(
            title="Hair Salon",
            description="Haircut appointment",
            start_time=today + timedelta(days=1, hours=15),
            end_time=today + timedelta(days=1, hours=16, minutes=30),
            category="self-care",
            location="Friseur Stroheck, 1090 Wien",
            color="#9C27B0"
        ),
        
        # This week
        CalendarEvent(
            title="Coffee with Marion",
            description="Meet sister for coffee",
            start_time=today + timedelta(days=3, hours=14),
            end_time=today + timedelta(days=3, hours=16),
            category="personal",
            location="Café Landtmann",
            color="#1976D2"
        ),
        CalendarEvent(
            title="Benny Grooming",
            description="Monthly grooming session",
            start_time=today + timedelta(days=5, hours=11),
            end_time=today + timedelta(days=5, hours=12),
            category="benny",
            location="Hundepflege Wien",
            color="#4CAF50"
        ),
        CalendarEvent(
            title="Billa Weekly Shopping",
            description="Weekly grocery shopping",
            start_time=today + timedelta(days=6, hours=10),
            end_time=today + timedelta(days=6, hours=11, minutes=30),
            category="shopping",
            location="Billa, Alser Straße",
            color="#FF9800"
        ),
        
        # Next week
        CalendarEvent(
            title="Visit Hollabrunn",
            description="Visit Marion and Reinhard in Magersdorf",
            start_time=today + timedelta(days=9, hours=13),
            end_time=today + timedelta(days=9, hours=18),
            category="personal",
            location="Hollabrunn, Magersdorf",
            color="#1976D2"
        ),
        CalendarEvent(
            title="Benny Park Meetup",
            description="Weekly dog meetup at Augarten",
            start_time=today + timedelta(days=10, hours=16),
            end_time=today + timedelta(days=10, hours=17, minutes=30),
            category="benny",
            location="Augarten, 1020 Wien",
            color="#4CAF50"
        ),
        CalendarEvent(
            title="Japanese Language Practice",
            description="Online Japanese conversation practice",
            start_time=today + timedelta(days=12, hours=19),
            end_time=today + timedelta(days=12, hours=20),
            category="personal",
            location="Online (Zoom)",
            color="#1976D2"
        ),
    ]
    
    for event in events:
        db.add(event)
    
    db.commit()
    print(f"✅ Added {len(events)} calendar events")
    
    # Count and display
    total_events = db.query(CalendarEvent).count()
    upcoming = db.query(CalendarEvent).filter(
        CalendarEvent.start_time >= datetime.now()
    ).count()
    
    print(f"\n📊 Database now has:")
    print(f"   Total events: {total_events}")
    print(f"   Upcoming: {upcoming}")
    
    # Show next 3 events
    next_events = db.query(CalendarEvent).filter(
        CalendarEvent.start_time >= datetime.now()
    ).order_by(CalendarEvent.start_time).limit(3).all()
    
    print(f"\n📅 Next 3 events:")
    for event in next_events:
        print(f"   • {event.title} - {event.start_time.strftime('%a %d %b, %H:%M')}")
    
    print("\n✅ Calendar events added successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()

