import json
import random
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Application, User
from ..schemas import ApplicationCreate
from ..security import get_current_user_optional

router = APIRouter(prefix="/applications", tags=["Applications & Appointments"])


def _default_history(date_str: str, time_slot: str) -> list:
    return [
        {
            "title": "Application Logged",
            "time": "Just now",
            "done": True,
            "desc": "Online appointment request recorded on Aasra portal."
        },
        {
            "title": "SAA Officer Assigned",
            "time": "Within 4 Hours",
            "done": True,
            "desc": "Case coordinator designated for document review."
        },
        {
            "title": "In-Person Slot Confirmed",
            "time": f"{date_str} • {time_slot}",
            "done": True,
            "current": True,
            "desc": "Appointment verified. Please report at reception with KYC proofs."
        },
        {
            "title": "Document Physical Verification",
            "time": "Day of Visit",
            "done": False,
            "desc": "Physical check of KYC, marriage, and income credentials."
        },
        {
            "title": "CARINGS Official Registration",
            "time": "Post Consultation",
            "done": False,
            "desc": "Assistance with formal upload on cara.wcd.gov.in."
        }
    ]


def _format_app_response(app: Application) -> dict:
    history = []
    if app.history_json:
        try:
            history = json.loads(app.history_json)
        except Exception:
            history = _default_history(app.appointment_date, app.time_slot)
    else:
        history = _default_history(app.appointment_date, app.time_slot)

    return {
        "id": app.id,
        "trackingId": app.tracking_id,
        "agencyId": app.agency_id,
        "agencyName": app.agency_name,
        "agencyLocation": app.agency_location,
        "agencyPhone": app.agency_phone,
        "agencyAddress": app.agency_address or "",
        "parentName": app.parent_name,
        "coApplicantName": app.co_applicant_name or "",
        "phone": app.phone,
        "email": app.email,
        "city": app.city,
        "maritalStatus": app.marital_status,
        "purpose": app.purpose,
        "date": app.appointment_date,
        "timeSlot": app.time_slot,
        "notes": app.notes or "",
        "status": app.status,
        "currentStage": app.current_stage,
        "history": history,
        "createdAt": app.created_at.isoformat() if app.created_at else datetime.now().isoformat(),
    }


@router.get("")
def list_applications(
    query: Optional[str] = Query(None, description="Search by tracking ID, phone, or name"),
    phone: Optional[str] = Query(None, description="Filter by phone"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    db: Session = Depends(get_db),
):
    stmt = select(Application).order_by(Application.created_at.desc())

    if query:
        q = f"%{query.strip()}%"
        stmt = stmt.where(
            or_(
                Application.tracking_id.ilike(q),
                Application.phone.ilike(q),
                Application.parent_name.ilike(q),
                Application.email.ilike(q),
            )
        )
    if phone:
        stmt = stmt.where(Application.phone == phone.strip())
    if user_id:
        stmt = stmt.where(Application.user_id == user_id)

    records = db.scalars(stmt).all()
    return [_format_app_response(r) for r in records]


@router.get("/{tracking_id}")
def get_application(tracking_id: str, db: Session = Depends(get_db)):
    app = db.scalar(select(Application).where(Application.tracking_id == tracking_id.strip()))
    if not app:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Application '{tracking_id}' not found")
    return _format_app_response(app)


@router.post("", status_code=201)
def create_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    # Generate Tracking ID if not provided
    tracking_id = data.tracking_id
    if not tracking_id:
        prefix = data.agency_location[:2].upper() if len(data.agency_location) >= 2 else "IN"
        random_num = random.randint(10000, 99999)
        tracking_id = f"AASRA-{prefix}-{random_num}"

    # Ensure tracking ID is unique
    existing = db.scalar(select(Application).where(Application.tracking_id == tracking_id))
    if existing:
        tracking_id = f"AASRA-DL-{random.randint(10000, 99999)}"

    history = _default_history(data.date, data.time_slot)

    app = Application(
        tracking_id=tracking_id,
        user_id=user.id if user else None,
        agency_id=data.agency_id,
        agency_name=data.agency_name,
        agency_location=data.agency_location,
        agency_phone=data.agency_phone,
        agency_address=data.agency_address,
        parent_name=data.parent_name,
        co_applicant_name=data.co_applicant_name,
        phone=data.phone,
        email=data.email,
        city=data.city,
        marital_status=data.marital_status,
        purpose=data.purpose,
        appointment_date=data.date,
        time_slot=data.time_slot,
        notes=data.notes,
        status="Confirmed & Scheduled",
        current_stage=3,
        history_json=json.dumps(history),
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return {
        "success": True,
        "message": "Appointment booked and stored in database successfully!",
        "application": _format_app_response(app)
    }


@router.delete("/{tracking_id}", status_code=200)
def cancel_application(tracking_id: str, db: Session = Depends(get_db)):
    app = db.scalar(select(Application).where(Application.tracking_id == tracking_id.strip()))
    if not app:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Application '{tracking_id}' not found")
    db.delete(app)
    db.commit()
    return {"success": True, "message": f"Appointment {tracking_id} successfully cancelled."}
