from sqlalchemy.orm import Session
from typing import List
from app.dao.base_dao import BaseDAO
from app.models.recomendacion import Recomendacion
from app.models.cliente import Cliente
from app.dto.recomendacion_dto import GenerarRecomendacionDTO

class RecomendacionDAO(BaseDAO[Recomendacion, GenerarRecomendacionDTO, GenerarRecomendacionDTO]):
    def __init__(self):
        super().__init__(Recomendacion)

    def get_by_tipo_rostro(self, db: Session, tipo_rostro_id: int) -> List[Recomendacion]:
        return db.query(self.model).filter(self.model.idTipo == tipo_rostro_id).order_by(self.model.nivelCompatibilidad.desc()).all()

    def get_by_cliente(self, db: Session, cliente_id: int) -> List[Recomendacion]:
        cliente = db.query(Cliente).filter(Cliente.idUsuario == cliente_id).first()
        if not cliente or not cliente.idTipo:
            return []
        return self.get_by_tipo_rostro(db, cliente.idTipo)

    def clear_recomendaciones_for_tipo(self, db: Session, tipo_rostro_id: int) -> None:
        db.query(self.model).filter(self.model.idTipo == tipo_rostro_id).delete()
        db.commit()

recomendacion_dao = RecomendacionDAO()
