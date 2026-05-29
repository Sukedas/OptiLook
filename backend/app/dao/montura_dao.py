from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from app.dao.base_dao import BaseDAO
from app.models.montura import Montura
from app.dto.montura_dto import CreateMonturaDTO, UpdateMonturaDTO

class MonturaDAO(BaseDAO[Montura, CreateMonturaDTO, UpdateMonturaDTO]):
    def __init__(self):
        super().__init__(Montura)

    def get_multi_filtered(
        self,
        db: Session,
        *,
        gender: Optional[str] = None,
        color: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        has_stock: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Montura]:
        query = db.query(self.model)
        
        if gender:
            query = query.filter(self.model.generoMontura.ilike(gender))
        if color:
            query = query.filter(self.model.colorMontura.ilike(color))
        if min_price is not None:
            query = query.filter(self.model.precioMontura >= min_price)
        if max_price is not None:
            query = query.filter(self.model.precioMontura <= max_price)
        if has_stock is True:
            query = query.filter(self.model.stockMontura > 0)
            
        return query.offset(skip).limit(limit).all()

    def adjust_stock(self, db: Session, montura_id: int, stock_delta: int) -> Optional[Montura]:
        montura = self.get(db, montura_id)
        if montura:
            montura.stockMontura = max(0, montura.stockMontura + stock_delta)
            db.add(montura)
            db.commit()
            db.refresh(montura)
        return montura

montura_dao = MonturaDAO()
