from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from decimal import Decimal

class MaterialResponseDTO(BaseModel):
    idMaterial: int
    nombreMaterial: str

    model_config = ConfigDict(from_attributes=True)


class MonturaResponseDTO(BaseModel):
    idMontura: int
    idMaterial: int
    nombreMontura: str
    imagenMontura: str
    stockMontura: int
    colorMontura: str
    generoMontura: str
    precioMontura: Decimal
    
    material: Optional[MaterialResponseDTO] = None

    model_config = ConfigDict(from_attributes=True)


class CreateMonturaDTO(BaseModel):
    idMontura: Optional[int] = None
    idMaterial: int
    nombreMontura: str
    imagenMontura: str
    stockMontura: int
    colorMontura: str
    generoMontura: str
    precioMontura: Decimal


class UpdateMonturaDTO(BaseModel):
    nombreMontura: Optional[str] = None
    stockMontura: Optional[int] = None
    colorMontura: Optional[str] = None
    precioMontura: Optional[Decimal] = None


class AdjustStockDTO(BaseModel):
    stock: int = Field(..., description="Nuevo stock para la montura o cantidad a ajustar (si es absoluto)")
