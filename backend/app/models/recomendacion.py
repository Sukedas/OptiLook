from sqlalchemy import Column, BigInteger, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Recomendacion(Base):
    __tablename__ = "recomendacion"

    idRecomendacion = Column(BigInteger, primary_key=True)
    idTipo = Column(BigInteger, ForeignKey("tipoRostro.idTipo"), nullable=False)
    idMontura = Column(BigInteger, ForeignKey("montura.idMontura"), nullable=False)
    nivelCompatibilidad = Column(Integer, nullable=False)

    tipo_rostro = relationship("TipoRostro", back_populates="recomendaciones")
    montura = relationship("Montura", back_populates="recomendaciones")
