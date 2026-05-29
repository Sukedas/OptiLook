from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from app.core.database import get_db
from app.dto.montura_dto import MonturaResponseDTO, CreateMonturaDTO, UpdateMonturaDTO, AdjustStockDTO
from app.services.montura_service import montura_service

router = APIRouter()

@router.get("/", response_model=List[MonturaResponseDTO], summary="Listar monturas con filtros avanzados")
def get_monturas(
    gender: Optional[str] = Query(None, description="Filtrar por género: Unisex, Hombre, Mujer"),
    color: Optional[str] = Query(None, description="Filtrar por color del marco"),
    min_price: Optional[Decimal] = Query(None, description="Precio mínimo"),
    max_price: Optional[Decimal] = Query(None, description="Precio máximo"),
    has_stock: Optional[bool] = Query(None, description="Filtrar solo monturas con stock disponible"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Busca monturas en catálogo aplicando filtros opcionales de color, género y rango de precios.
    """
    return montura_service.get_monturas(
        db,
        gender=gender,
        color=color,
        min_price=min_price,
        max_price=max_price,
        has_stock=has_stock,
        skip=skip,
        limit=limit
    )


@router.post("/", response_model=MonturaResponseDTO, status_code=status.HTTP_201_CREATED, summary="Registrar nueva montura")
def create_montura(dto: CreateMonturaDTO, db: Session = Depends(get_db)):
    """
    Agrega un nuevo marco de gafas al catálogo.
    """
    return montura_service.create_montura(db, dto)


@router.get("/{id}", response_model=MonturaResponseDTO, summary="Obtener detalle de montura por ID")
def get_montura(id: int, db: Session = Depends(get_db)):
    """
    Consulta los detalles físicos, de material y de stock de un marco de gafas.
    """
    return montura_service.get_montura(db, id)


@router.put("/{id}", response_model=MonturaResponseDTO, summary="Actualizar información de montura")
def update_montura(id: int, dto: UpdateMonturaDTO, db: Session = Depends(get_db)):
    """
    Modifica las propiedades físicas o el precio de una montura en catálogo. 
    Lanza un error si el incremento supera el doble del precio actual (Trigger business rule).
    """
    return montura_service.update_montura(db, id, dto)


@router.patch("/{id}/stock", response_model=MonturaResponseDTO, summary="Ajustar stock de montura")
def adjust_montura_stock(id: int, dto: AdjustStockDTO, db: Session = Depends(get_db)):
    """
    Actualiza de forma absoluta y atómica el nivel de inventario para una montura específica.
    """
    return montura_service.adjust_stock(db, id, dto.stock)
