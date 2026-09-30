from datetime import date

from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=list[ExpenseRead])
def list_expenses(search: str | None = None, db: Session = Depends(get_db)):
    return ExpenseService(db).list(search)


@router.post("", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    return ExpenseService(db).create(payload)


@router.get("/export")
def export_expenses_csv(
    start_date: date | None = None,
    end_date: date | None = None,
    category_id: int | None = None,
    db: Session = Depends(get_db),
):
    """Download all (optionally filtered) expenses as a CSV file."""
    csv_content = ExpenseService(db).export_csv(start_date, end_date, category_id)
    filename = "bizexpense_export.csv"
    headers = {"Content-Disposition": f"attachment; filename={filename}"}
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv; charset=utf-8",
        headers=headers,
    )


@router.get("/{expense_id}", response_model=ExpenseRead)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    return ExpenseService(db).get(expense_id)


@router.put("/{expense_id}", response_model=ExpenseRead)
def update_expense(expense_id: int, payload: ExpenseUpdate, db: Session = Depends(get_db)):
    return ExpenseService(db).update(expense_id, payload)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    ExpenseService(db).delete(expense_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
