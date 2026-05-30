from sqlalchemy import Column, BigInteger, String, Boolean, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class TipoRostro(Base):
    __tablename__ = "tipoRostro"

    idTipo = Column(BigInteger, primary_key=True)
    nombreTipo = Column(String(255), nullable=False)
    descripcionTipo = Column(String(255), nullable=False)
    imagenTipo = Column(String(255), nullable=False)

    clientes = relationship("Cliente", back_populates="tipo_rostro")
    recomendaciones = relationship("Recomendacion", back_populates="tipo_rostro")


class Formula(Base):
    __tablename__ = "formulaOf"

    idFormula = Column(BigInteger, primary_key=True)
    idUsuario = Column(BigInteger, ForeignKey("usuario.idUsuario"), nullable=False)
    vigencia = Column(Boolean, nullable=False)
    fechaCarga = Column(DateTime, nullable=False)
    formulaPDF = Column(String(255), nullable=False)
    observacion = Column(String(255), nullable=False)

    usuario = relationship("Cliente", foreign_keys=[idUsuario], back_populates="formulas")


class Cliente(Base):
    __tablename__ = "usuario"

    idUsuario = Column(BigInteger, primary_key=True)
    idFormulaActual = Column(BigInteger, ForeignKey("formulaOf.idFormula"), nullable=True, unique=True)
    idTipo = Column(BigInteger, ForeignKey("tipoRostro.idTipo"), nullable=True)
    primerNombre = Column(String(255), nullable=False)
    segundoNombre = Column(String(255), nullable=False)
    primerApellido = Column(String(255), nullable=False)
    segundoApellido = Column(String(255), nullable=False)
    correoUsuario = Column(String(255), nullable=False, unique=True)
    fechaNacimiento = Column(Date, nullable=False)
    direccion = Column(String(255), nullable=False)
    hashContrasena = Column(BigInteger, nullable=False)
    rol = Column(String(255), nullable=False, server_default="cliente")

    tipo_rostro = relationship("TipoRostro", back_populates="clientes")
    formulas = relationship("Formula", foreign_keys=[Formula.idUsuario], back_populates="usuario")
    formula_actual = relationship("Formula", foreign_keys=[idFormulaActual])
    transacciones = relationship("Transaccion", back_populates="cliente")
