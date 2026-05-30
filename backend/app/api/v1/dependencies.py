from fastapi import Header, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.cliente import Cliente

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Cliente:
    """
    Extrae e inspecciona el Bearer token de autorización (bearer_token_{idUsuario})
    para recuperar al usuario actual de la base de datos de forma segura.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó token de autorización en la petición"
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El formato de autenticación debe ser Bearer <token>"
        )
    
    token = authorization.replace("Bearer ", "").strip()
    if not token.startswith("optilook_token_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticación no válido"
        )
    
    try:
        user_id_str = token.replace("optilook_token_", "")
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de token corrupto o inválido"
        )
        
    user = db.query(Cliente).filter(Cliente.idUsuario == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El usuario asociado al token no existe en el sistema"
        )
        
    if user.correoUsuario.startswith("deleted_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Esta cuenta ha sido dada de baja (soft-deleted)"
        )
        
    return user

def get_current_admin(current_user: Cliente = Depends(get_current_user)) -> Cliente:
    """
    Restringe el acceso de una ruta únicamente para usuarios con rol de administrador.
    """
    if current_user.rol != "administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado: se requiere rol de administrador para realizar esta acción"
        )
    return current_user
