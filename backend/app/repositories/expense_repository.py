from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.expense import Expense


class ExpenseRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, search: str | None = None) -> list[Expense]:
        statement = select(Expense).options(joinedload(Expense.supplier), joinedload(Expense.category)).order_by(Expense.invoice_date.desc())
        if search:
            statement = statement.join(Expense.supplier).where(
                Expense.description.ilike(f"%{search}%") | Expense.supplier.has(name=search)
            )
        return list(self.db.scalars(statement).all())

    def list_for_export(
        self,
        start_date: date | None = None,
        end_date: date | None = None,
        category_id: int | None = None,
    ) -> list[Expense]:
        statement = (
            select(Expense)
            .options(joinedload(Expense.supplier), joinedload(Expense.category))
            .order_by(Expense.invoice_date.desc())
        )
        if start_date is not None:
            statement = statement.where(Expense.invoice_date >= start_date)
        if end_date is not None:
            statement = statement.where(Expense.invoice_date <= end_date)
        if category_id is not None:
            statement = statement.where(Expense.category_id == category_id)
        return list(self.db.scalars(statement).all())

    def get(self, expense_id: int) -> Expense | None:
        return self.db.scalar(select(Expense).options(joinedload(Expense.supplier), joinedload(Expense.category)).where(Expense.id == expense_id))

    def save(self, expense: Expense) -> Expense:
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        return self.get(expense.id)  # type: ignore[return-value]

    def delete(self, expense: Expense) -> None:
        self.db.delete(expense)
        self.db.commit()

