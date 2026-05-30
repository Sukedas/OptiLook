from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import date, datetime
from typing import Optional, List

class TipoRostroResponseDTO(BaseModel):
    idTipo: int
    nombreTipo: str
    descripcionTipo: str
    imagenTipo: str

    model_config = ConfigDict(from_attributes=True)


class FormulaResponseDTO(BaseModel):
    idFormula: int
    idUsuario: int
    vigencia: bool
    fechaCarga: datetime
    formulaPDF: str
    observacion: str

    model_config = ConfigDict(from_attributes=True)


class CreateFormulaDTO(BaseModel):
    idFormula: int
    idUsuario: int
    vigencia: bool
    formulaPDF: str
    observacion: str


class ClienteResponseDTO(BaseModel):
    idUsuario: int
    idFormulaActual: Optional[int] = None
    idTipo: Optional[int] = None
    primerNombre: str
    segundoNombre: str
    primerApellido: str
    segundoApellido: str
    correoUsuario: str
    fechaNacimiento: date
    direccion: str
    rol: str
    
    # We omit hashContrasena in output for security
    tipo_rostro: Optional[TipoRostroResponseDTO] = None
    formula_actual: Optional[FormulaResponseDTO] = None

    model_config = ConfigDict(from_attributes=True)


class CreateClienteDTO(BaseModel):
    idUsuario: int
    primerNombre: str
    segundoNombre: str
    primerApellido: str
    segundoApellido: str
    correoUsuario: EmailStr
    fechaNacimiento: date
    direccion: str
    contrasena: str  # Plain text contrasena, which we will hash into hashContrasena
    rol: Optional[str] = "cliente"


class UpdateClienteDTO(BaseModel):
    primerNombre: Optional[str] = None
    segundoNombre: Optional[str] = None
    primerApellido: Optional[str] = None
    segundoApellido: Optional[str] = None
    correoUsuario: Optional[EmailStr] = None
    direccion: Optional[str] = None
    idTipo: Optional[int] = None
    idFormulaActual: Optional[int] = None
    rol: Optional[str] = None
