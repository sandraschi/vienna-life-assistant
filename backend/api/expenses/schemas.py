"""
Expense API Schemas
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List
from decimal import Decimal


class ExpenseBase(BaseModel):
    """Base expense schema"""
    date: date
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    currency: str = Field(default="EUR", max_length=3)
    category: str
    store: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None


class ExpenseCreate(ExpenseBase):
    """Schema for creating expenses"""
    pass


class ExpenseUpdate(BaseModel):
    """Schema for updating expenses"""
    date: Optional[date] = None
    amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    currency: Optional[str] = Field(None, max_length=3)
    category: Optional[str] = None
    store: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None


class ExpenseResponse(ExpenseBase):
    """Schema for expense responses"""
    id: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class ExpenseListResponse(BaseModel):
    """Paginated expense list response"""
    expenses: List[ExpenseResponse]
    total: int
    page: int
    page_size: int


class ExpenseStatsResponse(BaseModel):
    """Expense statistics"""
    total_expenses: int
    total_amount: float
    by_category: dict
    by_store: dict
    recent_total: float

