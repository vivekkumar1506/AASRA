from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Category
from ..schemas import CategoryCreate, CategoryOut
from ..security import get_current_user

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(Category).order_by(Category.name)).all()


@router.post("", response_model=CategoryOut, status_code=201, dependencies=[Depends(get_current_user)])
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    category = Category(name=data.name)
    db.add(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Category already exists")
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=204, dependencies=[Depends(get_current_user)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    db.delete(category)
    db.commit()
