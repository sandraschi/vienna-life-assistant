"""
Expense Model
Tracks spending and receipts
"""
from sqlalchemy import Column, String, DateTime, Numeric, Date, Text, Enum as SQLEnum, JSON
import uuid
from datetime import datetime
import enum
from .base import Base


class ExpenseCategory(str, enum.Enum):
    """Expense categories"""
    GROCERIES = "groceries"
    PET = "pet"
    PERSONAL = "personal"
    HOUSEHOLD = "household"
    HEALTH = "health"
    TRANSPORT = "transport"
    OTHER = "other"


class Expense(Base):
    """Expense tracking model"""
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Transaction details
    date = Column(Date, nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="EUR", nullable=False)
    
    # Categorization
    # Use String for SQLite compatibility
    category = Column(
        String(50),
        default="other",
        nullable=False,
        index=True
    )
    store = Column(String(100), nullable=True, index=True)
    description = Column(Text, nullable=True)
    
    # Receipt management
    receipt_image = Column(String(255), nullable=True)
    
    # Tags for additional categorization (JSON array for SQLite)
    tags = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Expense(id={self.id}, amount={self.amount} {self.currency}, category={self.category})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            "id": str(self.id),
            "date": self.date.isoformat() if self.date else None,
            "amount": float(self.amount),
            "currency": self.currency,
            "category": self.category,  # Already a string
            "store": self.store,
            "description": self.description,
            "receipt_image": self.receipt_image,
            "tags": self.tags,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

