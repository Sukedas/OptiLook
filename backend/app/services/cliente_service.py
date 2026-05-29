from sqlalchemy.orm import Session
from typing import List, Optional
import hashlib
from fastapi import HTTPException

from app.dao.cliente_dao import cliente_dao
from app.models.cliente import Cliente, Formula
from app.models.transaccion import Transaccion
from app.dto.cliente_dto import CreateClienteDTO, UpdateClienteDTO

def hash_password_to_int(password: str) -> int:
    # Use SHA-256 to hash the password string, and convert the resulting digest to a 63-bit integer
    h = hashlib.sha256(password.encode("utf-8")).hexdigest()
    val = int(h, 16)
    # PostgreSQL BIGINT is signed 64-bit: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
    return val % 9000000000000000000

class ClienteService:
    def get_clientes(self, db: Session, skip: int = 0, limit: int = 100) -> List[Cliente]:
        # Filter out soft-deleted clients (simulate by omitting deleted email prefix)
        all_clientes = cliente_dao.get_multi(db, skip=skip, limit=limit)
        return [c for c in all_clientes if not c.correoUsuario.startswith("deleted_")]

    def get_cliente(self, db: Session, cliente_id: int) -> Cliente:
        cliente = cliente_dao.get(db, cliente_id)
        if not cliente or cliente.correoUsuario.startswith("deleted_"):
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        return cliente

    def create_cliente(self, db: Session, dto: CreateClienteDTO) -> Cliente:
        # Check if email already exists and is active
        existente = cliente_dao.get_by_email(db, dto.correoUsuario)
        if existente and not existente.correoUsuario.startswith("deleted_"):
            raise HTTPException(status_code=400, detail="El correo ya se encuentra registrado")
            
        hashed = hash_password_to_int(dto.contrasena)
        
        # Create client dict mapping plain 'contrasena' to 'hashContrasena'
        client_data = dto.model_dump()
        del client_data["contrasena"]
        client_data["hashContrasena"] = hashed
        
        # Check if there is an existing soft-deleted record, and overwrite or delete it,
        # or simply create a new one with the manual ID provided
        check_id = cliente_dao.get(db, dto.idUsuario)
        if check_id:
            # Overwrite the soft-deleted user
            return cliente_dao.update(db, db_obj=check_id, obj_in=client_data)
            
        return cliente_dao.create(db, obj_in=client_data)

    def update_cliente(self, db: Session, cliente_id: int, dto: UpdateClienteDTO) -> Cliente:
        cliente = self.get_cliente(db, cliente_id)
        return cliente_dao.update(db, db_obj=cliente, obj_in=dto)

    def delete_cliente(self, db: Session, cliente_id: int) -> Cliente:
        cliente = self.get_cliente(db, cliente_id)
        return cliente_dao.soft_delete(db, cliente_id)

    def get_transacciones(self, db: Session, cliente_id: int) -> List[Transaccion]:
        self.get_cliente(db, cliente_id) # Verifies existence
        return cliente_dao.get_transacciones(db, cliente_id)

cliente_service = ClienteService()
