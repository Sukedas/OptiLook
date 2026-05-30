from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.dao.base_dao import BaseDAO
from app.models.transaccion import Transaccion, TransaccionDetalle
from app.dto.transaccion_dto import CreateTransaccionDTO, UpdateTransaccionEstadoDTO

class TransaccionDAO(BaseDAO[Transaccion, CreateTransaccionDTO, UpdateTransaccionEstadoDTO]):
    def __init__(self):
        super().__init__(Transaccion)

    def get_multi_filtered(
        self,
        db: Session,
        *,
        status: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        cliente_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Transaccion]:
        query = db.query(self.model)
        if status:
            query = query.filter(self.model.estadoTransaccion.ilike(status))
        if date_from:
            query = query.filter(self.model.fechaTransaccion >= date_from)
        if date_to:
            query = query.filter(self.model.fechaTransaccion <= date_to)
        if cliente_id:
            query = query.filter(self.model.idUsuario == cliente_id)
        return query.order_by(self.model.fechaTransaccion.desc()).offset(skip).limit(limit).all()

    def get_detalle(self, db: Session, detalle_id: int) -> Optional[TransaccionDetalle]:
        return db.query(TransaccionDetalle).filter(TransaccionDetalle.idRequiere == detalle_id).first()

transaccion_dao = TransaccionDAO()
