"""
Shopping Models
Shopping lists, items, and store offers
"""

from sqlalchemy import Column, String, DateTime, Numeric, Boolean, Integer, Date, Text
from sqlalchemy import ForeignKey
import uuid
from datetime import datetime
import enum
from .base import Base


class Store(str, enum.Enum):
    """Austrian store chains"""

    SPAR = "spar"
    BILLA = "billa"
    HOFER = "hofer"
    DM = "dm"
    FRESSNAPF = "fressnapf"
    OTHER = "other"


class ShoppingList(Base):
    """Shopping list container"""

    __tablename__ = "shopping_lists"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    store_preference = Column(String(50), nullable=True)  # SQLite compatibility
    completed = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<ShoppingList(id={self.id}, name='{self.name}')>"

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "store_preference": self.store_preference.value
            if self.store_preference
            else None,
            "completed": self.completed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class ShoppingItem(Base):
    """Individual shopping item"""

    __tablename__ = "shopping_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    quantity = Column(Numeric(10, 2), default=1.0)
    unit = Column(String(20), nullable=True)  # kg, l, pieces, etc.
    estimated_price = Column(Numeric(10, 2), nullable=True)

    store_preference = Column(String(50), nullable=True)  # SQLite compatibility
    purchased = Column(Boolean, default=False, nullable=False, index=True)

    # Link to shopping list
    list_id = Column(String(36), ForeignKey("shopping_lists.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    def __repr__(self):
        return f"<ShoppingItem(id={self.id}, name='{self.name}', purchased={self.purchased})>"

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "quantity": float(self.quantity) if self.quantity else None,
            "unit": self.unit,
            "estimated_price": float(self.estimated_price)
            if self.estimated_price
            else None,
            "store_preference": self.store_preference.value
            if self.store_preference
            else None,
            "purchased": self.purchased,
            "list_id": str(self.list_id),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class StoreOffer(Base):
    """Store promotional offers from Spar, Billa, etc."""

    __tablename__ = "store_offers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    store = Column(String(50), nullable=False, index=True)  # SQLite compatibility
    product_name = Column(String(255), nullable=False, index=True)

    # Pricing
    original_price = Column(Numeric(10, 2), nullable=True)
    discounted_price = Column(Numeric(10, 2), nullable=False)
    discount_percentage = Column(Integer, nullable=True)

    # Validity
    valid_from = Column(Date, nullable=False, index=True)
    valid_until = Column(Date, nullable=False, index=True)

    # Additional info
    category = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)

    # Scraping metadata
    scraped_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    def __repr__(self):
        return f"<StoreOffer(id={self.id}, store={self.store}, product='{self.product_name}')>"

    def to_dict(self):
        return {
            "id": str(self.id),
            "store": self.store.value,
            "product_name": self.product_name,
            "original_price": float(self.original_price)
            if self.original_price
            else None,
            "discounted_price": float(self.discounted_price),
            "discount_percentage": self.discount_percentage,
            "valid_from": self.valid_from.isoformat() if self.valid_from else None,
            "valid_until": self.valid_until.isoformat() if self.valid_until else None,
            "category": self.category,
            "image_url": self.image_url,
            "scraped_at": self.scraped_at.isoformat() if self.scraped_at else None,
        }
