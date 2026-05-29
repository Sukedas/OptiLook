from abc import ABC, abstractmethod
from typing import Dict, Any
from sqlalchemy.orm import Session

class EventObserver(ABC):
    @abstractmethod
    def update(self, db: Session, event: str, data: Dict[str, Any]) -> None:
        """
        Método invocado por el EventPublisher cuando se dispara un evento.
        Recibe la sesión de la base de datos, el nombre del evento y un diccionario de datos.
        """
        pass
