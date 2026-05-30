from sqlalchemy.orm import Session
from typing import List, Optional
import hashlib
from datetime import datetime
from fastapi import HTTPException

from app.dao.cliente_dao import cliente_dao
from app.models.cliente import Cliente, Formula
from app.models.transaccion import Transaccion
from app.dto.cliente_dto import CreateClienteDTO, UpdateClienteDTO, CreateFormulaDTO, UpdateFormulaDTO

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

    def get_formulas(self, db: Session, cliente_id: int) -> List[Formula]:
        self.get_cliente(db, cliente_id) # Verifica existencia
        return cliente_dao.get_formulas(db, cliente_id)

    def create_formula(self, db: Session, cliente_id: int, dto: CreateFormulaDTO) -> Formula:
        self.get_cliente(db, cliente_id) # Verifica existencia
        
        # Generar ID de fórmula correlativo si es necesario
        if dto.idFormula <= 0:
            from sqlalchemy import func
            max_id = db.query(func.max(Formula.idFormula)).scalar()
            dto.idFormula = (max_id + 1) if max_id is not None else 101
            
        new_formula = Formula(
            idFormula=dto.idFormula,
            idUsuario=cliente_id,
            vigencia=dto.vigencia,
            fechaCarga=datetime.now(),
            formulaPDF=dto.formulaPDF,
            observacion=dto.observacion
        )
        db.add(new_formula)
        db.commit()
        db.refresh(new_formula)
        
        # Activar automáticamente como fórmula actual del cliente si no tiene una
        cliente = cliente_dao.get(db, cliente_id)
        if cliente and not cliente.idFormulaActual:
            cliente.idFormulaActual = new_formula.idFormula
            db.add(cliente)
            db.commit()
            
        return new_formula

    def update_formula(self, db: Session, formula_id: int, dto: UpdateFormulaDTO) -> Formula:
        formula = db.query(Formula).filter(Formula.idFormula == formula_id).first()
        if not formula:
            raise HTTPException(status_code=404, detail="Fórmula óptica no encontrada")
            
        formula.vigencia = dto.vigencia
        formula.formulaPDF = dto.formulaPDF
        formula.observacion = dto.observacion
        
        db.add(formula)
        db.commit()
        db.refresh(formula)
        return formula

    def activar_formula(self, db: Session, cliente_id: int, formula_id: int) -> Cliente:
        cliente = self.get_cliente(db, cliente_id)
        
        # Verificar que la fórmula pertenezca al cliente
        formula = db.query(Formula).filter(Formula.idFormula == formula_id, Formula.idUsuario == cliente_id).first()
        if not formula:
            raise HTTPException(status_code=404, detail="La fórmula óptica no existe o no pertenece a este cliente")
            
        cliente.idFormulaActual = formula_id
        db.add(cliente)
        db.commit()
        db.refresh(cliente)
        return cliente

cliente_service = ClienteService()
