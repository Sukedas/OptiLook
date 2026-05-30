from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException
from app.dao.transaccion_dao import transaccion_dao
from app.models.transaccion import Transaccion
from app.dto.transaccion_dto import CreateTransaccionDTO, UpdateTransaccionEstadoDTO
from app.facades.optilook_facade import optilook_facade

class TransaccionService:
    def get_transacciones(
        self,
        db: Session,
        status: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        cliente_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Transaccion]:
        return transaccion_dao.get_multi_filtered(
            db,
            status=status,
            date_from=date_from,
            date_to=date_to,
            cliente_id=cliente_id,
            skip=skip,
            limit=limit
        )

    def get_transaccion(self, db: Session, transaccion_id: int) -> Transaccion:
        tx = transaccion_dao.get(db, transaccion_id)
        if not tx:
            raise HTTPException(status_code=404, detail="Transacción no encontrada")
        return tx

    def create_transaccion(self, db: Session, dto: CreateTransaccionDTO) -> Transaccion:
        # Check if transaction ID already exists
        existente = transaccion_dao.get(db, dto.idTransaccion)
        if existente:
            raise HTTPException(status_code=400, detail="El ID de transacción ya se encuentra registrado")
            
        items_dict = [item.model_dump() for item in dto.detalles]
        return optilook_facade.procesar_venta(
            db=db,
            cliente_id=dto.idUsuario,
            direccion_envio=dto.direccionEnvio,
            metodo_pago=dto.metodoPago,
            tipo_transaccion=dto.tipoTransaccion or "Compra",
            items=items_dict
        )

    def actualizar_estado(self, db: Session, transaccion_id: int, dto: UpdateTransaccionEstadoDTO) -> Transaccion:
        return optilook_facade.cambiar_estado_transaccion(db, transaccion_id, dto.estado)

transaccion_service = TransaccionService()
