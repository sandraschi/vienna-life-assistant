"""
Expense API Routes
Track spending and manage expenses
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy import func
from models.base import SessionLocal
from models.expense import Expense
from .schemas import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseListResponse,
    ExpenseStatsResponse
)

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.get("/", response_model=ExpenseListResponse)
async def list_expenses(
    category: Optional[str] = None,
    store: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """List expenses with filtering and pagination"""
    db = SessionLocal()
    try:
        query = db.query(Expense)
        
        # Apply filters
        if category:
            query = query.filter(Expense.category == category)
        if store:
            query = query.filter(Expense.store.ilike(f"%{store}%"))
        if start_date:
            query = query.filter(Expense.date >= start_date)
        if end_date:
            query = query.filter(Expense.date <= end_date)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and order
        expenses = query.order_by(Expense.date.desc())\
            .offset((page - 1) * page_size)\
            .limit(page_size)\
            .all()
        
        return {
            "expenses": [ExpenseResponse.model_validate(exp.to_dict()) for exp in expenses],
            "total": total,
            "page": page,
            "page_size": page_size,
        }
    finally:
        db.close()


@router.get("/stats", response_model=ExpenseStatsResponse)
async def get_expense_stats():
    """Get expense statistics"""
    db = SessionLocal()
    try:
        total_expenses = db.query(Expense).count()
        
        # Total amount
        total_amount = db.query(func.sum(Expense.amount)).scalar() or 0
        
        # By category
        by_category = {}
        category_stats = db.query(
            Expense.category,
            func.sum(Expense.amount),
            func.count(Expense.id)
        ).group_by(Expense.category).all()
        
        for cat, amount, count in category_stats:
            by_category[cat] = {
                "amount": float(amount or 0),
                "count": count
            }
        
        # By store
        by_store = {}
        store_stats = db.query(
            Expense.store,
            func.sum(Expense.amount),
            func.count(Expense.id)
        ).filter(Expense.store.isnot(None))\
         .group_by(Expense.store)\
         .order_by(func.sum(Expense.amount).desc())\
         .limit(10).all()
        
        for store, amount, count in store_stats:
            by_store[store] = {
                "amount": float(amount or 0),
                "count": count
            }
        
        # Recent (last 30 days)
        thirty_days_ago = datetime.now().date() - timedelta(days=30)
        recent_total = db.query(func.sum(Expense.amount))\
            .filter(Expense.date >= thirty_days_ago)\
            .scalar() or 0
        
        return {
            "total_expenses": total_expenses,
            "total_amount": float(total_amount),
            "by_category": by_category,
            "by_store": by_store,
            "recent_total": float(recent_total),
        }
    finally:
        db.close()


@router.post("/", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate):
    """Create a new expense"""
    db = SessionLocal()
    try:
        db_expense = Expense(
            date=expense.date,
            amount=expense.amount,
            currency=expense.currency,
            category=expense.category,
            store=expense.store,
            description=expense.description,
            tags=expense.tags,
        )
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return ExpenseResponse.model_validate(db_expense.to_dict())
    finally:
        db.close()


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(expense_id: str):
    """Get a specific expense"""
    db = SessionLocal()
    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        return ExpenseResponse.model_validate(expense.to_dict())
    finally:
        db.close()


@router.patch("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(expense_id: str, expense_update: ExpenseUpdate):
    """Update an expense"""
    db = SessionLocal()
    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        # Update fields
        update_data = expense_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(expense, field, value)
        
        db.commit()
        db.refresh(expense)
        return ExpenseResponse.model_validate(expense.to_dict())
    finally:
        db.close()


@router.delete("/{expense_id}")
async def delete_expense(expense_id: str):
    """Delete an expense"""
    db = SessionLocal()
    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        db.delete(expense)
        db.commit()
        return {"message": "Expense deleted successfully"}
    finally:
        db.close()

