from typing import List
from app.strategies.base_strategy import FaceRecommendationStrategy
from app.models.montura import Montura

class OvalStrategy(FaceRecommendationStrategy):
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        results = []
        for montura in monturas:
            name = montura.nombreMontura.lower()
            # Oval faces look good in almost anything, especially geometric/rectangular frames
            if "square" in name or "edge" in name or "bold" in name:
                score = 95
            elif "oval" in name or "round" in name:
                score = 85
            else:
                score = 80
            results.append({"montura": montura, "score": score})
        return sorted(results, key=lambda x: x["score"], reverse=True)


class RedondoStrategy(FaceRecommendationStrategy):
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        results = []
        for montura in monturas:
            name = montura.nombreMontura.lower()
            # Round faces need contrast: square, rectangular, or angular frames are best.
            if "square" in name or "edge" in name or "bold" in name:
                score = 93
            elif "oval" in name or "round" in name:
                score = 55  # Round frames exacerbate roundness
            else:
                score = 75
            results.append({"montura": montura, "score": score})
        return sorted(results, key=lambda x: x["score"], reverse=True)


class CuadradoStrategy(FaceRecommendationStrategy):
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        results = []
        for montura in monturas:
            name = montura.nombreMontura.lower()
            # Square faces need round or oval frames to soften the jawline.
            if "oval" in name or "round" in name or "soft" in name:
                score = 94
            elif "square" in name or "edge" in name:
                score = 50  # Square frames exacerbate hard angles
            else:
                score = 78
            results.append({"montura": montura, "score": score})
        return sorted(results, key=lambda x: x["score"], reverse=True)


class CorazonStrategy(FaceRecommendationStrategy):
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        results = []
        for montura in monturas:
            name = montura.nombreMontura.lower()
            # Heart faces look best in light, rimless, or thin frames (oval/round)
            if "light" in name or "slim" in name or "flex" in name:
                score = 95
            elif "oval" in name or "round" in name:
                score = 88
            elif "bold" in name or "eco" in name:
                score = 60  # Too heavy on top
            else:
                score = 75
            results.append({"montura": montura, "score": score})
        return sorted(results, key=lambda x: x["score"], reverse=True)


class DiamanteStrategy(FaceRecommendationStrategy):
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        results = []
        for montura in monturas:
            name = montura.nombreMontura.lower()
            # Diamond faces have wide cheekbones. Oval/round frames or bold frames look great.
            if "bold" in name or "nature" in name:
                score = 92
            elif "oval" in name or "round" in name:
                score = 90
            elif "square" in name or "edge" in name:
                score = 65
            else:
                score = 78
            results.append({"montura": montura, "score": score})
        return sorted(results, key=lambda x: x["score"], reverse=True)


class DefaultStrategy(FaceRecommendationStrategy):
    def recomendar(self, monturas: List[Montura]) -> List[dict]:
        results = []
        for montura in monturas:
            results.append({"montura": montura, "score": 75})
        return results
