from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.dto.cliente_dto import ClienteResponseDTO, CreateClienteDTO, UpdateClienteDTO
from app.dto.transaccion_dto import TransaccionResponseDTO
from app.services.cliente_service import cliente_service

router = APIRouter()

@router.get("/", response_model=List[ClienteResponseDTO], summary="Listar clientes con paginación")
def get_clientes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Lista todos los clientes registrados activos con paginación.
    """
    return cliente_service.get_clientes(db, skip=skip, limit=limit)


@router.post("/", response_model=ClienteResponseDTO, status_code=status.HTTP_201_CREATED, summary="Crear un nuevo cliente")
def create_cliente(dto: CreateClienteDTO, db: Session = Depends(get_db)):
    """
    Registra un nuevo cliente y genera un hash de su contraseña.
    """
    return cliente_service.create_cliente(db, dto)


@router.get("/{id}", response_model=ClienteResponseDTO, summary="Obtener detalle de cliente por ID")
def get_cliente(id: int, db: Session = Depends(get_db)):
    """
    Retorna la información detallada de un cliente específico.
    """
    return cliente_service.get_cliente(db, id)


@router.put("/{id}", response_model=ClienteResponseDTO, summary="Actualizar información de cliente")
def update_cliente(id: int, dto: UpdateClienteDTO, db: Session = Depends(get_db)):
    """
    Actualiza los campos permitidos del cliente.
    """
    return cliente_service.update_cliente(db, id, dto)


@router.delete("/{id}", response_model=ClienteResponseDTO, summary="Eliminar cliente (Soft Delete)")
def delete_cliente(id: int, db: Session = Depends(get_db)):
    """
    Realiza una baja lógica de un cliente en el sistema para conservar datos históricos.
    """
    return cliente_service.delete_cliente(db, id)


@router.get("/{id}/transacciones", response_model=List[TransaccionResponseDTO], summary="Ver historial de transacciones de un cliente")
def get_cliente_transacciones(id: int, db: Session = Depends(get_db)):
    """
    Consulta todas las órdenes de compra o cotizaciones realizadas por el cliente.
    """
    return cliente_service.get_transacciones(db, id)
