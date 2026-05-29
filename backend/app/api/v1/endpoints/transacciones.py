from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.dto.transaccion_dto import TransaccionResponseDTO, CreateTransaccionDTO, UpdateTransaccionEstadoDTO
from app.services.transaccion_service import transaccion_service

router = APIRouter()

@router.get("/", response_model=List[TransaccionResponseDTO], summary="Listar transacciones con filtros")
def get_transacciones(
    status: Optional[str] = Query(None, description="Filtrar por estado: Pendiente, Confirmada, Procesando, Completada, Cancelada"),
    date_from: Optional[datetime] = Query(None, description="Fecha de inicio (ISO 8601)"),
    date_to: Optional[datetime] = Query(None, description="Fecha de fin (ISO 8601)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Lista y filtra las transacciones registradas del negocio en rango de fechas e indicador de estado.
    """
    return transaccion_service.get_transacciones(
        db,
        status=status,
        date_from=date_from,
        date_to=date_to,
        skip=skip,
        limit=limit
    )


@router.post("/", response_model=TransaccionResponseDTO, status_code=status.HTTP_201_CREATED, summary="Procesar nueva transacción")
def create_transaccion(dto: CreateTransaccionDTO, db: Session = Depends(get_db)):
    """
    Registra una nueva transacción (Compra, Cotización, Devolución) calculando totales
    y ejecutando efectos secundarios de negocio vía EventPublisher (como decremento de stock).
    """
    return transaccion_service.create_transaccion(db, dto)


@router.get("/{id}", response_model=TransaccionResponseDTO, summary="Obtener detalle de transacción con items")
def get_transaccion(id: int, db: Session = Depends(get_db)):
    """
    Consulta los datos principales de cobro y dirección de envío junto a la lista de items adquiridos.
    """
    return transaccion_service.get_transaccion(db, id)


@router.patch("/{id}/estado", response_model=TransaccionResponseDTO, summary="Evolucionar estado de transacción (State Pattern)")
def transition_transaccion_estado(id: int, dto: UpdateTransaccionEstadoDTO, db: Session = Depends(get_db)):
    """
    Transiciona el estado de la transacción (ej. Pendiente -> Confirmada) de acuerdo a las leyes
    del patrón State, disparando eventos a los observers correspondientes (ej. Stock, Auditoría).
    """
    return transaccion_service.actualizar_estado(db, id, dto)
