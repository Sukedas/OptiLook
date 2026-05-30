from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.models.cliente import Cliente
from app.dto.cliente_dto import ClienteResponseDTO, CreateClienteDTO
from app.services.cliente_service import cliente_service, hash_password_to_int

router = APIRouter()

class LoginDTO(BaseModel):
    correoUsuario: EmailStr
    contrasena: str

class LoginResponseDTO(BaseModel):
    user: ClienteResponseDTO
    token: str

@router.post("/login", response_model=LoginResponseDTO, summary="Iniciar sesión en la aplicación")
def login(dto: LoginDTO, db: Session = Depends(get_db)):
    """
    Verifica las credenciales del usuario (correo y contraseña), calcula el hash 
    e inicia sesión si coinciden, retornando la información de usuario, su rol y su token.
    """
    # Buscar el usuario por email
    user = db.query(Cliente).filter(Cliente.correoUsuario == dto.correoUsuario).first()
    if not user or user.correoUsuario.startswith("deleted_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credenciales incorrectas: correo o contraseña inválidos"
        )
        
    # Verificar contraseña
    hashed = hash_password_to_int(dto.contrasena)
    if user.hashContrasena != hashed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credenciales incorrectas: correo o contraseña inválidos"
        )
        
    # Generar token (bearer token simple: optilook_token_{idUsuario})
    token = f"optilook_token_{user.idUsuario}"
    
    return {
        "user": user,
        "token": token
    }

@router.post("/register", response_model=ClienteResponseDTO, status_code=status.HTTP_201_CREATED, summary="Registrar un nuevo cliente")
def register(dto: CreateClienteDTO, db: Session = Depends(get_db)):
    """
    Crea una cuenta para un nuevo cliente en el sistema.
    """
    # Forzar rol a 'cliente' para registros públicos
    dto.rol = "cliente"
    
    # Si no se provee un ID de usuario válido (por ejemplo, es <= 0), generarlo correlativamente
    if dto.idUsuario <= 0:
        from sqlalchemy import func
        max_id = db.query(func.max(Cliente.idUsuario)).scalar()
        dto.idUsuario = (max_id + 1) if max_id is not None else 1
        
    return cliente_service.create_cliente(db, dto)
