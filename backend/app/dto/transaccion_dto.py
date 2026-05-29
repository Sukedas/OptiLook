from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from app.dto.montura_dto import MonturaResponseDTO

class TransaccionDetalleResponseDTO(BaseModel):
    idRequiere: int
    idMontura: int
    idFormula: Optional[int] = None
    idTransaccion: int
    subtotal: int
    lentesR: bool
    cantidadR: int
    precioUnitarioR: Decimal
    
    montura: Optional[MonturaResponseDTO] = None

    model_config = ConfigDict(from_attributes=True)


class TransaccionResponseDTO(BaseModel):
    idTransaccion: int
    idUsuario: int
    fechaTransaccion: datetime
    direccionEnvio: str
    estadoTransaccion: str
    metodoPago: str
    totalTransaccion: Decimal
    
    detalles: List[TransaccionDetalleResponseDTO] = []

    model_config = ConfigDict(from_attributes=True)


class CreateTransaccionDetalleDTO(BaseModel):
    idMontura: int
    idFormula: Optional[int] = None
    lentesR: bool
    cantidadR: int
    precioUnitarioR: Decimal


class CreateTransaccionDTO(BaseModel):
    idTransaccion: int
    idUsuario: int
    direccionEnvio: str
    metodoPago: str
    tipoTransaccion: Optional[str] = "Compra"  # "Compra", "Devolucion", "Cotizacion"
    detalles: List[CreateTransaccionDetalleDTO]


class UpdateTransaccionEstadoDTO(BaseModel):
    estado: str  # e.g., "Confirmada", "Procesando", "Completada", "Cancelada"
