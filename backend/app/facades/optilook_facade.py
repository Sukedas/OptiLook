from sqlalchemy.orm import Session
from datetime import datetime
from decimal import Decimal
from typing import List, Dict, Any, Optional
import time
import random
from fastapi import HTTPException

from app.models.transaccion import Transaccion, TransaccionDetalle
from app.models.recomendacion import Recomendacion
from app.models.cliente import Cliente, TipoRostro
from app.models.montura import Montura

from app.dao.cliente_dao import cliente_dao
from app.dao.montura_dao import montura_dao
from app.dao.transaccion_dao import transaccion_dao
from app.dao.recomendacion_dao import recomendacion_dao

from app.factories.transaction_factory import TransactionFactory
from app.factories.recommendation_factory import RecommendationFactory
from app.states.transaction_states import get_state_instance
from app.observers.event_publisher import event_publisher

class OptiLookFacade:
    @staticmethod
    def _generate_id() -> int:
        # Generates a safe positive 63-bit integer using current timestamp and random digits
        # to prevent primary key conflicts in tables without SERIAL/Auto-Increment.
        epoch_ms = int(time.time() * 1000)
        random_part = random.randint(100, 999)
        # BigInt fits up to 9,223,372,036,854,775,807, this fits comfortably
        return int(f"{epoch_ms % 10000000000}{random_part}")

    def procesar_venta(
        self,
        db: Session,
        cliente_id: int,
        direccion_envio: str,
        metodo_pago: str,
        tipo_transaccion: str,
        items: List[Dict[str, Any]]
    ) -> Transaccion:
        # 1. Verificar cliente
        cliente = cliente_dao.get(db, cliente_id)
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")

        # 2. Validar stock y calcular total
        total = Decimal("0.00")
        detalles_a_crear = []
        
        for item in items:
            id_montura = item["idMontura"]
            cantidad = item["cantidadR"]
            id_formula = item.get("idFormula")
            lentes_r = item.get("lentesR", False)
            precio_unitario = Decimal(str(item["precioUnitarioR"]))
            
            # Obtener montura
            montura = montura_dao.get(db, id_montura)
            if not montura:
                raise HTTPException(status_code=404, detail=f"Montura {id_montura} no encontrada")
                
            # Solo verificar stock para compras reales (no cotizaciones o devoluciones)
            if tipo_transaccion.lower() == "compra":
                if montura.stockMontura < cantidad:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Stock insuficiente para {montura.nombreMontura}. Disponible: {montura.stockMontura}, Requerido: {cantidad}"
                    )
            
            subtotal = int(cantidad * precio_unitario)
            total += precio_unitario * cantidad
            
            detalles_a_crear.append({
                "idMontura": id_montura,
                "idFormula": id_formula,
                "subtotal": subtotal,
                "lentesR": lentes_r,
                "cantidadR": cantidad,
                "precioUnitarioR": precio_unitario
            })

        # 3. Crear Transacción usando Factory
        tx_id = self._generate_id()
        transaccion = TransactionFactory.create_transaction(
            id_transaccion=tx_id,
            id_usuario=cliente_id,
            direccion_envio=direccion_envio,
            metodo_pago=metodo_pago,
            total=total,
            tipo=tipo_transaccion
        )
        
        db.add(transaccion)
        db.commit()
        db.refresh(transaccion)

        # 4. Crear Detalles (requiere)
        for det_data in detalles_a_crear:
            det_id = self._generate_id()
            detalle = TransaccionDetalle(
                idRequiere=det_id,
                idMontura=det_data["idMontura"],
                idFormula=det_data["idFormula"],
                idTransaccion=tx_id,
                subtotal=det_data["subtotal"],
                lentesR=det_data["lentesR"],
                cantidadR=det_data["cantidadR"],
                precioUnitarioR=det_data["precioUnitarioR"]
            )
            db.add(detalle)
        
        db.commit()
        db.refresh(transaccion)

        # 5. Publicar evento
        event_publisher.publish(db, "transaction_created", {"transaction": transaccion})
        
        return transaccion

    def cambiar_estado_transaccion(self, db: Session, transaccion_id: int, nuevo_estado: str) -> Transaccion:
        # 1. Obtener transacción
        transaccion = transaccion_dao.get(db, transaccion_id)
        if not transaccion:
            raise HTTPException(status_code=404, detail="Transacción no encontrada")
            
        old_state = transaccion.estadoTransaccion
        if old_state == nuevo_estado:
            return transaccion
            
        # 2. Utilizar el State Pattern para validar y realizar transición
        try:
            state_instance = get_state_instance(old_state)
            
            # Ejecutar transición
            nuevo_estado_normalizado = nuevo_estado.lower()
            if nuevo_estado_normalizado == "confirmada":
                state_instance.confirmar(transaccion)
            elif nuevo_estado_normalizado == "procesando":
                state_instance.procesar(transaccion)
            elif nuevo_estado_normalizado == "completada":
                state_instance.completar(transaccion)
            elif nuevo_estado_normalizado == "cancelada":
                state_instance.cancelar(transaccion)
            else:
                raise HTTPException(status_code=400, detail=f"Estado destino no reconocido: {nuevo_estado}")
                
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
            
        # 3. Guardar cambios en DB
        db.add(transaccion)
        db.commit()
        db.refresh(transaccion)
        
        # 4. Publicar evento de cambio de estado
        event_publisher.publish(
            db,
            "transaction_state_changed",
            {
                "transaction": transaccion,
                "old_state": old_state,
                "new_state": transaccion.estadoTransaccion
            }
        )
        
        return transaccion

    def generar_recomendacion(self, db: Session, cliente_id: int, tipo_rostro_id: int) -> List[Recomendacion]:
        # 1. Verificar cliente
        cliente = cliente_dao.get(db, cliente_id)
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
            
        # 2. Verificar tipo rostro
        tipo_rostro = db.query(TipoRostro).filter(TipoRostro.idTipo == tipo_rostro_id).first()
        if not tipo_rostro:
            raise HTTPException(status_code=404, detail="Tipo de rostro no encontrado")
            
        # 3. Actualizar tipo de rostro del cliente
        cliente.idTipo = tipo_rostro_id
        db.add(cliente)
        db.commit()
        
        # 4. Limpiar recomendaciones anteriores para este tipo de rostro
        recomendacion_dao.clear_recomendaciones_for_tipo(db, tipo_rostro_id)
        
        # 5. Obtener todas las monturas para procesar con la estrategia
        monturas = db.query(Montura).all()
        
        # 6. Obtener estrategia usando Factory
        strategy = RecommendationFactory.get_strategy(tipo_rostro_id)
        
        # 7. Ejecutar recomendación (scoring)
        scores = strategy.recomendar(monturas)
        
        # 8. Almacenar recomendaciones calculadas en base de datos
        nuevas_recos = []
        for item in scores:
            rec_id = self._generate_id()
            reco = Recomendacion(
                idRecomendacion=rec_id,
                idTipo=tipo_rostro_id,
                idMontura=item["montura"].idMontura,
                nivelCompatibilidad=item["score"]
            )
            db.add(reco)
            nuevas_recos.append(reco)
            
        db.commit()
        
        # 9. Publicar evento
        event_publisher.publish(
            db,
            "recommendation_generated",
            {
                "cliente_id": cliente_id,
                "tipo_rostro_id": tipo_rostro_id,
                "tipo_rostro": tipo_rostro.nombreTipo
            }
        )
        
        # Refrescar y retornar con relaciones cargadas
        return db.query(Recomendacion).filter(Recomendacion.idTipo == tipo_rostro_id).order_by(Recomendacion.nivelCompatibilidad.desc()).all()

optilook_facade = OptiLookFacade()
