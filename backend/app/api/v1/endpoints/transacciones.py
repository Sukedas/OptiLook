from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.dto.transaccion_dto import TransaccionResponseDTO, CreateTransaccionDTO, UpdateTransaccionEstadoDTO
from app.services.transaccion_service import transaccion_service
from app.api.v1.dependencies import get_current_user, get_current_admin
from app.models.cliente import Cliente

router = APIRouter()

@router.get("/", response_model=List[TransaccionResponseDTO], summary="Listar transacciones con filtros")
def get_transacciones(
    status: Optional[str] = Query(None, description="Filtrar por estado: Pendiente, Confirmada, Procesando, Completada, Cancelada"),
    date_from: Optional[datetime] = Query(None, description="Fecha de inicio (ISO 8601)"),
    date_to: Optional[datetime] = Query(None, description="Fecha de fin (ISO 8601)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Lista y filtra las transacciones registradas del negocio en rango de fechas e indicador de estado.
    """
    # Si el usuario es un cliente, forzar a que sólo vea sus propias transacciones
    cliente_id = current_user.idUsuario if current_user.rol == "cliente" else None
    
    return transaccion_service.get_transacciones(
        db,
        status=status,
        date_from=date_from,
        date_to=date_to,
        cliente_id=cliente_id,
        skip=skip,
        limit=limit
    )


@router.post("/", response_model=TransaccionResponseDTO, status_code=status.HTTP_201_CREATED, summary="Procesar nueva transacción")
def create_transaccion(
    dto: CreateTransaccionDTO, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Registra una nueva transacción (Compra, Cotización, Devolución) calculando totales
    y ejecutando efectos secundarios de negocio vía EventPublisher (como decremento de stock).
    """
    # Si el usuario es un cliente, validar que sólo pueda crear transacciones para sí mismo
    if current_user.rol == "cliente" and dto.idUsuario != current_user.idUsuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no puedes crear transacciones para otros clientes"
        )
    return transaccion_service.create_transaccion(db, dto)


@router.get("/{id}", response_model=TransaccionResponseDTO, summary="Obtener detalle de transacción con items")
def get_transaccion(
    id: int, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Consulta los datos principales de cobro y dirección de envío junto a la lista de items adquiridos.
    """
    tx = transaccion_service.get_transaccion(db, id)
    # Un cliente sólo puede ver los detalles de sus propias transacciones
    if current_user.rol != "administrador" and tx.idUsuario != current_user.idUsuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no puedes ver transacciones de otros clientes"
        )
    return tx


@router.patch("/{id}/estado", response_model=TransaccionResponseDTO, summary="Evolucionar estado de transacción (State Pattern)")
def transition_transaccion_estado(
    id: int, 
    dto: UpdateTransaccionEstadoDTO, 
    db: Session = Depends(get_db),
    admin: Cliente = Depends(get_current_admin)
):
    """
    Transiciona el estado de la transacción (ej. Pendiente -> Confirmada) de acuerdo a las leyes
    del patrón State, disparando eventos a los observers correspondientes (ej. Stock, Auditoría).
    """
    return transaccion_service.actualizar_estado(db, id, dto)
