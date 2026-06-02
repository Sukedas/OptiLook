from sqlalchemy.orm import Session
from typing import Optional, List
from app.dao.base_dao import BaseDAO
from app.models.cliente import Cliente, Formula
from app.models.transaccion import Transaccion
from app.dto.cliente_dto import CreateClienteDTO, UpdateClienteDTO

class ClienteDAO(BaseDAO[Cliente, CreateClienteDTO, UpdateClienteDTO]):
    def __init__(self):
        super().__init__(Cliente)

    def get_by_email(self, db: Session, email: str) -> Optional[Cliente]:
        return db.query(self.model).filter(self.model.correoUsuario == email).first()

    def get_transacciones(self, db: Session, cliente_id: int) -> List[Transaccion]:
        return db.query(Transaccion).filter(Transaccion.idUsuario == cliente_id).all()

    def get_formulas(self, db: Session, cliente_id: int) -> List[Formula]:
        return db.query(Formula).filter(Formula.idUsuario == cliente_id).all()

    def soft_delete(self, db: Session, cliente_id: int) -> Optional[Cliente]:
        # Dado que el esquema de la base de datos no tiene una columna "activo" o "eliminado",
        # simularemos la eliminación lógica renombrando el correo electrónico a 'eliminado_{id}_{correo electrónico}'
        # y registrándolo, o simplemente eliminándolo. Añadamos "ELIMINADO_" al correo electrónico
        # para liberarlo para nuevos registros e impedir el inicio de sesión, que es una forma estándar
        # de implementar la eliminación lógica en esquemas heredados sin modificar las tablas.
        cliente = self.get(db, cliente_id)
        if cliente:
            if not cliente.correoUsuario.startswith("deleted_"):
                cliente.correoUsuario = f"deleted_{cliente.idUsuario}_{cliente.correoUsuario}"
                db.add(cliente)
                db.commit()
                db.refresh(cliente)
        return cliente

cliente_dao = ClienteDAO()
