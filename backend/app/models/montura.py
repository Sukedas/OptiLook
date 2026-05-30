from sqlalchemy import Column, BigInteger, String, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Material(Base):
    __tablename__ = "material"

    idMaterial = Column(BigInteger, primary_key=True)
    nombreMaterial = Column(String(255), nullable=False)

    monturas = relationship("Montura", back_populates="material")


class Montura(Base):
    __tablename__ = "montura"

    idMontura = Column(BigInteger, primary_key=True)
    idMaterial = Column(BigInteger, ForeignKey("material.idMaterial"), nullable=False)
    nombreMontura = Column(String(255), nullable=False)
    imagenMontura = Column(String(255), nullable=False)
    stockMontura = Column(Integer, nullable=False)
    colorMontura = Column(String(255), nullable=False)
    generoMontura = Column(String(255), nullable=False)
    precioMontura = Column(Numeric(8, 2), nullable=False)

    material = relationship("Material", back_populates="monturas")
    recomendaciones = relationship("Recomendacion", back_populates="montura")
    detalles_transaccion = relationship("TransaccionDetalle", back_populates="montura")
