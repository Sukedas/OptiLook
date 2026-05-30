from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Transaccion(Base):
    __tablename__ = "transaccion"

    idTransaccion = Column(BigInteger, primary_key=True)
    idUsuario = Column(BigInteger, ForeignKey("usuario.idUsuario"), nullable=False)
    fechaTransaccion = Column(DateTime, nullable=False)
    direccionEnvio = Column(String(255), nullable=False)
    estadoTransaccion = Column(String(255), nullable=False)
    metodoPago = Column(String(255), nullable=False)
    totalTransaccion = Column(Numeric(8, 2), nullable=False)

    cliente = relationship("Cliente", back_populates="transacciones")
    detalles = relationship("TransaccionDetalle", back_populates="transaccion", cascade="all, delete-orphan")


class TransaccionDetalle(Base):
    __tablename__ = "requiere"

    idRequiere = Column(BigInteger, primary_key=True)
    idMontura = Column(BigInteger, ForeignKey("montura.idMontura"), nullable=False)
    idFormula = Column(BigInteger, ForeignKey("formulaOf.idFormula"), nullable=True)
    idTransaccion = Column(BigInteger, ForeignKey("transaccion.idTransaccion"), nullable=False)
    subtotal = Column(BigInteger, nullable=False)
    lentesR = Column(Boolean, nullable=False)
    cantidadR = Column(BigInteger, nullable=False)
    precioUnitarioR = Column(Numeric(8, 2), nullable=False)

    transaccion = relationship("Transaccion", back_populates="detalles")
    montura = relationship("Montura", back_populates="detalles_transaccion")
    formula = relationship("Formula")
