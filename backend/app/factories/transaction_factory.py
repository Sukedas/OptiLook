from datetime import datetime
from decimal import Decimal
from app.models.transaccion import Transaccion

class TransactionFactory:
    @staticmethod
    def create_transaction(
        id_transaccion: int,
        id_usuario: int,
        direccion_envio: str,
        metodo_pago: str,
        total: Decimal,
        tipo: str = "Compra"
    ) -> Transaccion:
        fecha = datetime.now()
        
        tipo_lower = tipo.lower()
        if tipo_lower == "compra":
            estado = "Confirmada"
        elif tipo_lower == "devolucion":
            estado = "Completada"  # Devolución processes immediately
        elif tipo_lower in ["cotizacion", "cotización"]:
            estado = "Pendiente"   # Cotización starts pending
        else:
            estado = "Pendiente"
            
        return Transaccion(
            idTransaccion=id_transaccion,
            idUsuario=id_usuario,
            fechaTransaccion=fecha,
            direccionEnvio=direccion_envio,
            estadoTransaccion=estado,
            metodoPago=metodo_pago,
            totalTransaccion=total
        )
