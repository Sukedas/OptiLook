from typing import Dict, Any
from sqlalchemy.orm import Session
from app.observers.base_observer import EventObserver

class NotificationObserver(EventObserver):
    def update(self, db: Session, event: str, data: Dict[str, Any]) -> None:
        if event == "transaction_created":
            transaction = data.get("transaction")
            if transaction:
                print(f"[NotificationObserver] Notificación enviada al Cliente {transaction.idUsuario}: Transacción #{transaction.idTransaccion} creada con total ${transaction.totalTransaccion}.")
        elif event == "transaction_state_changed":
            transaction = data.get("transaction")
            old_state = data.get("old_state")
            new_state = data.get("new_state")
            if transaction:
                print(f"[NotificationObserver] Notificación enviada al Cliente {transaction.idUsuario}: Tu pedido #{transaction.idTransaccion} cambió de estado: {old_state} -> {new_state}.")
        elif event == "recommendation_generated":
            cliente_id = data.get("cliente_id")
            tipo_rostro = data.get("tipo_rostro")
            print(f"[NotificationObserver] Notificación enviada al Cliente {cliente_id}: Nuevas recomendaciones generadas para tipo de rostro '{tipo_rostro}'.")
