from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dto.recomendacion_dto import RecomendacionResponseDTO, GenerarRecomendacionDTO
from app.services.recomendacion_service import recomendacion_service
from app.api.v1.dependencies import get_current_user
from app.models.cliente import Cliente

router = APIRouter()

@router.post("/", response_model=List[RecomendacionResponseDTO], status_code=status.HTTP_201_CREATED, summary="Generar recomendaciones de monturas")
def generar_recomendaciones(
    dto: GenerarRecomendacionDTO, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Selecciona la estrategia de diseño correcta para el tipo de rostro del cliente
    utilizando RecommendationFactory y calcula la compatibilidad para todas las monturas en stock.
    """
    # Si es cliente, validar que sólo calcule sus propias recomendaciones
    if current_user.rol == "cliente" and dto.idUsuario != current_user.idUsuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no puedes generar recomendaciones para otros clientes"
        )
    return recomendacion_service.generar_recomendacion(db, dto)


@router.get("/{cliente_id}", response_model=List[RecomendacionResponseDTO], summary="Historial de recomendaciones de un cliente")
def get_cliente_recomendaciones(
    cliente_id: int, 
    db: Session = Depends(get_db),
    current_user: Cliente = Depends(get_current_user)
):
    """
    Consulta las recomendaciones históricas computadas para las facciones faciales de un cliente.
    """
    # Si es cliente, validar que sólo pueda obtener su propio historial
    if current_user.rol == "cliente" and cliente_id != current_user.idUsuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: no puedes ver las recomendaciones de otros clientes"
        )
    return recomendacion_service.get_historial_recomendaciones(db, cliente_id)
