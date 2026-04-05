"""
Journal API Routes

Endpoints for fetching daily journal notes from Advanced Memory (ADN).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
from services.journal_service import journal_service

router = APIRouter()


@router.get("/daily-consolidated")
async def get_daily_consolidated(
    date: Optional[str] = Query(
        None,
        description="Date in YYYY-MM-DD format. Defaults to today if not provided."
    )
):
    """
    Get consolidated daily journal note for a specific date.

    Returns the "best of" consolidated note that combines highlights from all IDE streams.
    """
    try:
        # Use today's date if not provided
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        # Validate date format
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

        result = await journal_service.get_daily_consolidated(date)
        return result

    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower() or "note not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail=f"No journal entry found for {date}")
        raise HTTPException(status_code=500, detail=f"Error fetching journal: {error_msg}")


@router.get("/ide-streams")
async def get_ide_streams(
    date: Optional[str] = Query(
        None,
        description="Date in YYYY-MM-DD format. Defaults to today if not provided."
    )
):
    """
    Get all IDE stream notes for a specific date.

    Returns individual daily notes from each IDE (Antigravity, Cursor, Windsurf, Zed).
    """
    try:
        # Use today's date if not provided
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        # Validate date format
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

        result = await journal_service.get_ide_streams(date)
        return result

    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower() or "no ide stream" in error_msg.lower():
            raise HTTPException(status_code=404, detail=f"No IDE stream notes found for {date}")
        raise HTTPException(status_code=500, detail=f"Error fetching IDE streams: {error_msg}")


@router.get("/available-dates")
async def get_available_dates(
    start_date: Optional[str] = Query(
        None,
        description="Start date in YYYY-MM-DD format"
    ),
    end_date: Optional[str] = Query(
        None,
        description="End date in YYYY-MM-DD format"
    )
):
    """
    Get list of dates that have journal entries available.

    This searches for daily notes in the ADN knowledge base.
    """
    try:
        # This would require searching ADN for notes matching the pattern
        # For now, return a simple response indicating the feature needs implementation
        raise HTTPException(
            status_code=501,
            detail="Available dates endpoint not yet implemented. Use specific date endpoints instead."
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching available dates: {str(e)}")
