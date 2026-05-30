from abc import ABC, abstractmethod
from typing import List
from app.models.montura import Montura

class FaceRecommendationStrategy(ABC):
    @abstractmethod
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        """
        Dada una lista de monturas, calcula el nivel de compatibilidad (0-100)
        y retorna una lista de diccionarios con {montura: Montura, score: int}.
        """
        pass
