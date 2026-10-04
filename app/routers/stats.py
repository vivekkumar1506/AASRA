from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db, active_db_type
from ..models import Application, Category, CounselingBooking, Entry, User

router = APIRouter(prefix="/stats", tags=["Dashboard Stats"])


@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    """Numbers for the dashboard: totals, by status, by category, applications, counseling, users."""
    total_entries = db.scalar(select(func.count(Entry.id))) or 0
    total_apps = db.scalar(select(func.count(Application.id))) or 0
    total_counseling = db.scalar(select(func.count(CounselingBooking.id))) or 0
    total_users = db.scalar(select(func.count(User.id))) or 0

    by_status = db.execute(
        select(Entry.status, func.count(Entry.id)).group_by(Entry.status)
    ).all()

    by_category = db.execute(
        select(func.coalesce(Category.name, "Uncategorized"), func.count(Entry.id))
        .select_from(Entry)
        .outerjoin(Category, Entry.category_id == Category.id)
        .group_by(Category.name)
    ).all()

    app_by_status = db.execute(
        select(Application.status, func.count(Application.id)).group_by(Application.status)
    ).all()

    return {
        "status": "healthy",
        "active_database": active_db_type,
        "total_entries": total_entries,
        "total_applications": total_apps,
        "total_counseling": total_counseling,
        "total_users": total_users,
        "by_status": [{"status": s, "count": c} for s, c in by_status],
        "by_category": [{"category": n, "count": c} for n, c in by_category],
        "applications_by_status": [{"status": s, "count": c} for s, c in app_by_status],
    }
