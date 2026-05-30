from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.dto.montura_dto import MonturaResponseDTO

class RecomendacionResponseDTO(BaseModel):
    idRecomendacion: int
    idTipo: int
    idMontura: int
    nivelCompatibilidad: int
    
    montura: Optional[MonturaResponseDTO] = None

    model_config = ConfigDict(from_attributes=True)


class GenerarRecomendacionDTO(BaseModel):
    idUsuario: int
    idTipo: int  # Face type ID to run the strategy against
