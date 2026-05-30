from typing import Dict, Any
from sqlalchemy.orm import Session
from app.observers.base_observer import EventObserver

class StockObserver(EventObserver):
    def update(self, db: Session, event: str, data: Dict[str, Any]) -> None:
        from app.dao.montura_dao import montura_dao
        
        # When a transaction is created, check if it's already in an active state
        if event == "transaction_created":
            transaction = data.get("transaction")
            if not transaction:
                return
            
            # If the transaction is active (not pending and not canceled), reduce stock
            if transaction.estadoTransaccion in ["Confirmada", "Procesando", "Completada", "En preparacion"]:
                for detail in transaction.detalles:
                    print(f"[StockObserver] Decrementando stock de montura {detail.idMontura} en {detail.cantidadR} unidades.")
                    montura_dao.adjust_stock(db, detail.idMontura, -detail.cantidadR)
        
        # When state changes
        elif event == "transaction_state_changed":
            transaction = data.get("transaction")
            old_state = data.get("old_state")
            new_state = data.get("new_state")
            if not transaction or not old_state or not new_state:
                return
            
            # If it's transitioning to Cancelada, we restore the stock if it was previously active
            if new_state == "Cancelada" and old_state in ["Confirmada", "Procesando", "Completada", "En preparacion"]:
                for detail in transaction.detalles:
                    print(f"[StockObserver] Restaurando stock de montura {detail.idMontura} en {detail.cantidadR} unidades debido a cancelación.")
                    montura_dao.adjust_stock(db, detail.idMontura, detail.cantidadR)
            
            # If transitioning from Pendiente to active
            elif old_state == "Pendiente" and new_state in ["Confirmada", "Procesando", "Completada", "En preparacion"]:
                for detail in transaction.detalles:
                    print(f"[StockObserver] Reservando stock de montura {detail.idMontura} en {detail.cantidadR} unidades debido a confirmación.")
                    montura_dao.adjust_stock(db, detail.idMontura, -detail.cantidadR)
