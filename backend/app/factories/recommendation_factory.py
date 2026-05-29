from app.strategies.base_strategy import FaceRecommendationStrategy
from app.strategies.recommendation_strategies import (
    OvalStrategy, RedondoStrategy, CuadradoStrategy,
    CorazonStrategy, DiamanteStrategy, DefaultStrategy
)

class RecommendationFactory:
    @staticmethod
    def get_strategy(tipo_rostro_id_or_name) -> FaceRecommendationStrategy:
        val = str(tipo_rostro_id_or_name).lower().strip()
        
        if val in ["1", "ovalado", "oval"]:
            return OvalStrategy()
        elif val in ["2", "redondo", "round"]:
            return RedondoStrategy()
        elif val in ["3", "cuadrado", "square"]:
            return CuadradoStrategy()
        elif val in ["4", "corazon", "corazón", "heart"]:
            return CorazonStrategy()
        elif val in ["5", "diamante", "diamond"]:
            return DiamanteStrategy()
        else:
            return DefaultStrategy()
