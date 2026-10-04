from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import CounselingBooking
from ..schemas import CounselingCreate, CounselingOut

router = APIRouter(prefix="/counseling", tags=["Counseling Sessions"])


@router.post("", status_code=201)
def book_counseling(data: CounselingCreate, db: Session = Depends(get_db)):
    if not data.phone or len(data.phone.strip()) < 10:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Valid 10-digit phone number is required.")

    booking = CounselingBooking(
        name=data.name.strip() or "Anonymous Friend",
        phone=data.phone.strip(),
        mode=data.mode or "Phone Call",
        topic=data.topic,
        status="Confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "success": True,
        "message": f"Counseling session booked successfully for {booking.name}.",
        "booking_id": booking.id,
        "status": booking.status,
    }


@router.get("")
def list_counselings(db: Session = Depends(get_db)):
    return db.scalars(select(CounselingBooking).order_by(CounselingBooking.created_at.desc())).all()
