from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.dto.cliente_dto import ClienteResponseDTO, CreateClienteDTO, UpdateClienteDTO
from app.dto.transaccion_dto import TransaccionResponseDTO
from app.services.cliente_service import cliente_service
from app.api.v1.dependencies import get_current_user, get_current_admin
from app.models.cliente import Cliente

router = APIRouter()

@router.get("/", response_model=List[ClienteResponseDTO], summary="Listar clientes con paginación")
def get_clientes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: Cliente = Depends(get_current_admin)
):
    """
    Lista todos los clientes registrados activos con paginación. (Exclusivo de Administradores)
    """
    return cliente_service.get_clientes(db, skip=skip, limit=limit)


@router.post("/", response_model=ClienteResponseDTO, status_code=status.HTTP_201_CREATED, summary="Crear un nuevo cliente")
def create_cliente(
    dto: CreateClienteDTO, 
    db: Session = Depends(get_db),
    current_user: Optional[Cliente] = Depends(get_current_user)
):
    """
    Registra un nuevo cliente y genera un hash de su contraseña.
    """
    # Si se intenta asignar rol de administrador, validar que el solicitante sea admin principal
    if dto.rol == "administrador":
        if not current_user or current_user.correoUsuario != "admin@optilook.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo el administrador principal (admin@optilook.com) puede crear nuevos administradores"
            )
    return cliente_service.create_cliente(db, dto)


@router.get("/{id}", response_model=ClienteResponseDTO, summary="Obtener detalle de cliente por ID")
def get_cliente(
    id: int, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Retorna la información detallada de un cliente específico.
    """
    if current_user.rol != "administrador" and current_user.idUsuario != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no puedes ver la información de otros clientes"
        )
    return cliente_service.get_cliente(db, id)


@router.put("/{id}", response_model=ClienteResponseDTO, summary="Actualizar información de cliente")
def update_cliente(
    id: int, 
    dto: UpdateClienteDTO, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Actualiza los campos permitidos del cliente.
    """
    if current_user.rol != "administrador" and current_user.idUsuario != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no tienes permisos para actualizar la información de este cliente"
        )
        
    # Obtener el cliente original para validar cambios de rol
    cliente_existente = cliente_service.get_cliente(db, id)
    
    # Validar promoción a administrador o modificación del rol
    if dto.rol is not None and dto.rol != cliente_existente.rol:
        if current_user.correoUsuario != "admin@optilook.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo el administrador principal (admin@optilook.com) puede modificar el rol de un usuario"
            )
            
    return cliente_service.update_cliente(db, id, dto)


@router.delete("/{id}", response_model=ClienteResponseDTO, summary="Eliminar cliente (Soft Delete)")
def delete_cliente(
    id: int, 
    db: Session = Depends(get_db),
    admin: Cliente = Depends(get_current_admin)
):
    """
    Realiza una baja lógica de un cliente en el sistema para conservar datos históricos.
    """
    return cliente_service.delete_cliente(db, id)


@router.get("/{id}/transacciones", response_model=List[TransaccionResponseDTO], summary="Ver historial de transacciones de un cliente")
def get_cliente_transacciones(
    id: int, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Consulta todas las órdenes de compra o cotizaciones realizadas por el cliente.
    """
    if current_user.rol != "administrador" and current_user.idUsuario != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no puedes ver las transacciones de otros clientes"
        )
    return cliente_service.get_transacciones(db, id)
