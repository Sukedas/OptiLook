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
        # Since the database schema doesn't have an "activo" or "deleted" column,
        # we will simulate soft delete by renaming the email to 'deleted_{id}_{email}'
        # and logging it, or simply removing it. Let's append "DELETED_" to the email
        # to free it up for new registrations and prevent login, which is a standard way 
        # to implement soft delete on legacy schemas without altering tables.
        cliente = self.get(db, cliente_id)
        if cliente:
            if not cliente.correoUsuario.startswith("deleted_"):
                cliente.correoUsuario = f"deleted_{cliente.idUsuario}_{cliente.correoUsuario}"
                db.add(cliente)
                db.commit()
                db.refresh(cliente)
        return cliente

cliente_dao = ClienteDAO()
