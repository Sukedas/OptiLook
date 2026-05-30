from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from fastapi import HTTPException
from app.dao.montura_dao import montura_dao
from app.models.montura import Montura
from app.dto.montura_dto import CreateMonturaDTO, UpdateMonturaDTO

class MonturaService:
    def get_monturas(
        self,
        db: Session,
        gender: Optional[str] = None,
        color: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        has_stock: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Montura]:
        return montura_dao.get_multi_filtered(
            db,
            gender=gender,
            color=color,
            min_price=min_price,
            max_price=max_price,
            has_stock=has_stock,
            skip=skip,
            limit=limit
        )

    def get_montura(self, db: Session, montura_id: int) -> Montura:
        montura = montura_dao.get(db, montura_id)
        if not montura:
            raise HTTPException(status_code=404, detail="Montura no encontrada")
        return montura

    def create_montura(self, db: Session, dto: CreateMonturaDTO) -> Montura:
        if dto.idMontura is None or dto.idMontura <= 0:
            from sqlalchemy import func
            max_id = db.query(func.max(Montura.idMontura)).scalar()
            dto.idMontura = (max_id + 1) if max_id is not None else 1
            
        existente = montura_dao.get(db, dto.idMontura)
        if existente:
            raise HTTPException(status_code=400, detail="El ID de la montura ya se encuentra registrado")
        return montura_dao.create(db, obj_in=dto)

    def update_montura(self, db: Session, montura_id: int, dto: UpdateMonturaDTO) -> Montura:
        montura = self.get_montura(db, montura_id)
        
        # Trigger validation: check if update tries to increase price to double or more
        if dto.precioMontura is not None and dto.precioMontura > montura.precioMontura * 2:
            raise HTTPException(
                status_code=400,
                detail=f"El aumento en la montura supera el doble de su precio original. Precio actual: {montura.precioMontura}"
            )
            
        return montura_dao.update(db, db_obj=montura, obj_in=dto)

    def adjust_stock(self, db: Session, montura_id: int, stock: int) -> Montura:
        montura = self.get_montura(db, montura_id)
        # Calculate delta
        delta = stock - montura.stockMontura
        adjusted = montura_dao.adjust_stock(db, montura_id, delta)
        if not adjusted:
            raise HTTPException(status_code=500, detail="No se pudo ajustar el stock")
        return adjusted

montura_service = MonturaService()
