from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import ChildProfile
from ..schemas import ChildProfileOut

router = APIRouter(prefix="/children", tags=["Child Care Discovery"])


@router.get("", response_model=list[ChildProfileOut])
def get_children(
    category: Optional[str] = Query(None, description="Filter by category tag"),
    db: Session = Depends(get_db)
):
    stmt = select(ChildProfile).order_by(ChildProfile.id.asc())
    if category and category != "all":
        stmt = stmt.where(ChildProfile.category_tag == category)
    return db.scalars(stmt).all()
