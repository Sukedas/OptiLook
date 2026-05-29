from typing import Dict, Any
from sqlalchemy.orm import Session
from app.observers.base_observer import EventObserver
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("OptiLookAudit")

class AuditObserver(EventObserver):
    def update(self, db: Session, event: str, data: Dict[str, Any]) -> None:
        if event == "transaction_created":
            transaction = data.get("transaction")
            if transaction:
                logger.info(f"[AUDIT] Transacción {transaction.idTransaccion} creada para el usuario {transaction.idUsuario} por total {transaction.totalTransaccion}")
        elif event == "transaction_state_changed":
            transaction = data.get("transaction")
            old_state = data.get("old_state")
            new_state = data.get("new_state")
            if transaction:
                logger.info(f"[AUDIT] Transacción {transaction.idTransaccion} cambió su estado de '{old_state}' a '{new_state}'")
        elif event == "recommendation_generated":
            cliente_id = data.get("cliente_id")
            tipo_rostro_id = data.get("tipo_rostro_id")
            logger.info(f"[AUDIT] Recomendaciones generadas para el cliente {cliente_id} con rostro {tipo_rostro_id}")
