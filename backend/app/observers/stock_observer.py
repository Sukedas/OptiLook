from typing import Dict, Any
from sqlalchemy.orm import Session
from app.observers.base_observer import EventObserver

class StockObserver(EventObserver):
    def update(self, db: Session, event: str, data: Dict[str, Any]) -> None:
        from app.dao.montura_dao import montura_dao
        
        # Cuando se crea una transacción, compruebe si ya se encuentra en un estado activo.
        if event == "transaction_created":
            transaction = data.get("transaction")
            if not transaction:
                return
            
            # Si la transacción está activa (no pendiente ni cancelada), reduzca el stock.

            if transaction.estadoTransaccion in ["Confirmada", "Procesando", "Completada", "En preparacion"]:
                for detail in transaction.detalles:
                    print(f"[StockObserver] Decrementando stock de montura {detail.idMontura} en {detail.cantidadR} unidades.")
                    montura_dao.adjust_stock(db, detail.idMontura, -detail.cantidadR)
        
        # Cuando el estado cambia
        elif event == "transaction_state_changed":
            transaction = data.get("transaction")
            old_state = data.get("old_state")
            new_state = data.get("new_state")
            if not transaction or not old_state or not new_state:
                return
            
            # Si está en transición a Cancelada, restauramos el stock si estaba activo previamente.
            if new_state == "Cancelada" and old_state in ["Confirmada", "Procesando", "Completada", "En preparacion"]:
                for detail in transaction.detalles:
                    print(f"[StockObserver] Restaurando stock de montura {detail.idMontura} en {detail.cantidadR} unidades debido a cancelación.")
                    montura_dao.adjust_stock(db, detail.idMontura, detail.cantidadR)
            
            # Si la transición de Pendiente a activo

            elif old_state == "Pendiente" and new_state in ["Confirmada", "Procesando", "Completada", "En preparacion"]:
                for detail in transaction.detalles:
                    print(f"[StockObserver] Reservando stock de montura {detail.idMontura} en {detail.cantidadR} unidades debido a confirmación.")
                    montura_dao.adjust_stock(db, detail.idMontura, -detail.cantidadR)
