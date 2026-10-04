from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Category, Entry, User
from ..schemas import EntryCreate, EntryOut, EntryUpdate, Status
from ..security import get_current_user

router = APIRouter(prefix="/entries", tags=["Entries"])


def _check_category(db: Session, category_id: Optional[int]):
    if category_id is not None and db.get(Category, category_id) is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Category does not exist")


@router.get("", response_model=list[EntryOut])
def list_entries(
    category_id: Optional[int] = None,
    status_: Optional[Status] = Query(None, alias="status"),
    q: Optional[str] = Query(None, description="Search in title"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
):
    stmt = select(Entry).order_by(Entry.created_at.desc())
    if category_id is not None:
        stmt = stmt.where(Entry.category_id == category_id)
    if status_:
        stmt = stmt.where(Entry.status == status_)
    if q:
        stmt = stmt.where(Entry.title.like(f"%{q}%"))
    return db.scalars(stmt.offset(skip).limit(limit)).all()


@router.get("/{entry_id}", response_model=EntryOut)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Entry not found")
    return entry


@router.post("", response_model=EntryOut, status_code=201)
def create_entry(data: EntryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _check_category(db, data.category_id)
    entry = Entry(**data.model_dump(), created_by=user.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.patch("/{entry_id}", response_model=EntryOut, dependencies=[Depends(get_current_user)])
def update_entry(entry_id: int, data: EntryUpdate, db: Session = Depends(get_db)):
    entry = db.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Entry not found")
    changes = data.model_dump(exclude_unset=True)
    _check_category(db, changes.get("category_id"))
    for key, value in changes.items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204, dependencies=[Depends(get_current_user)])
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Entry not found")
    db.delete(entry)
    db.commit()
