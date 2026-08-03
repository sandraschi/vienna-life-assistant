"""First-run onboarding — guided form filling for basic life data.

The wizard writes through the same CRUD endpoints the UI uses (health,
medications, pet, subscriptions), plus a single-row UserProfile that gates
the Dashboard CTA (big red under-hero button until onboarded). The seeded
demo data is fine to keep — onboarding is about making it yours, not
deleting the example.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from vienna_life_assistant import life_db
from vienna_life_assistant.db import get_db
from vienna_life_assistant.models import UserProfile

logger = logging.getLogger("vienna-life-assistant.onboarding")

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])


def _profile(db: Session) -> UserProfile:
    row = db.get(UserProfile, 1)
    if row is None:
        row = UserProfile(id=1)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("/status")
async def onboarding_status(db: Session = Depends(get_db)) -> dict[str, Any]:
    profile = _profile(db)
    return {
        "ok": True,
        "onboarded": profile.onboarded,
        "profile": profile.to_dict(),
        "mock_data_note": "The app ships with demo data you can replace or keep.",
    }


@router.post("/profile")
async def onboarding_profile(
    body: dict[str, Any], db: Session = Depends(get_db)
) -> dict[str, Any]:
    profile = _profile(db)
    for key in ("first_name", "city", "timezone", "pet_name"):
        if body.get(key) is not None:
            setattr(profile, key, str(body[key])[:120])
    db.commit()
    db.refresh(profile)
    return {"ok": True, "profile": profile.to_dict()}


@router.post("/complete")
async def onboarding_complete(db: Session = Depends(get_db)) -> dict[str, Any]:
    profile = _profile(db)
    profile.onboarded = True
    profile.onboarded_at = datetime.now().isoformat(timespec="seconds")
    db.commit()
    db.refresh(profile)
    logger.info(
        "Onboarding complete for %s (%s)", profile.first_name or "?", profile.city
    )
    return {"ok": True, "profile": profile.to_dict()}


@router.post("/pet")
async def onboarding_pet(
    body: dict[str, Any], db: Session = Depends(get_db)
) -> dict[str, Any]:
    """Quick pet setup — name + a care event (vet/vaccination/grooming)."""
    from vienna_life_assistant.models import PetCareEvent

    pet_name = (body.get("pet_name") or "").strip() or "Benny"
    profile = _profile(db)
    profile.pet_name = pet_name[:80]
    event_type = (body.get("event_type") or "vet").strip()
    if body.get("next_due"):
        life_db.add_row(
            db,
            PetCareEvent,
            {
                "pet_name": pet_name,
                "event_type": event_type,
                "date": body.get("date", ""),
                "notes": body.get("notes", ""),
                "next_due": body.get("next_due", ""),
            },
        )
    db.commit()
    db.refresh(profile)
    return {"ok": True, "pet_name": pet_name, "profile": profile.to_dict()}
