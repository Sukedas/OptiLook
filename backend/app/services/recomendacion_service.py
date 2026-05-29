from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException
from app.dao.recomendacion_dao import recomendacion_dao
from app.models.recomendacion import Recomendacion
from app.dto.recomendacion_dto import GenerarRecomendacionDTO
from app.facades.optilook_facade import optilook_facade

class RecomendacionService:
    def generar_recomendacion(self, db: Session, dto: GenerarRecomendacionDTO) -> List[Recomendacion]:
        return optilook_facade.generar_recomendacion(
            db=db,
            cliente_id=dto.idUsuario,
            tipo_rostro_id=dto.idTipo
        )

    def get_historial_recomendaciones(self, db: Session, cliente_id: int) -> List[Recomendacion]:
        return recomendacion_dao.get_by_cliente(db, cliente_id)

recomendacion_service = RecomendacionService()
