from abc import ABC, abstractmethod

class TransactionState(ABC):
    @abstractmethod
    def get_name(self) -> str:
        pass

    def confirmar(self, transaccion) -> None:
        raise ValueError(f"Transición no permitida de '{self.get_name()}' a 'Confirmada'")

    def procesar(self, transaccion) -> None:
        raise ValueError(f"Transición no permitida de '{self.get_name()}' a 'Procesando'")

    def completar(self, transaccion) -> None:
        raise ValueError(f"Transición no permitida de '{self.get_name()}' a 'Completada'")

    def cancelar(self, transaccion) -> None:
        raise ValueError(f"Transición no permitida de '{self.get_name()}' a 'Cancelada'")


class PendienteState(TransactionState):
    def get_name(self) -> str:
        return "Pendiente"

    def confirmar(self, transaccion) -> None:
        transaccion.estadoTransaccion = "Confirmada"

    def cancelar(self, transaccion) -> None:
        transaccion.estadoTransaccion = "Cancelada"


class ConfirmadaState(TransactionState):
    def get_name(self) -> str:
        return "Confirmada"

    def procesar(self, transaccion) -> None:
        transaccion.estadoTransaccion = "Procesando"

    def cancelar(self, transaccion) -> None:
        transaccion.estadoTransaccion = "Cancelada"


class ProcesandoState(TransactionState):
    def get_name(self) -> str:
        return "Procesando"

    def completar(self, transaccion) -> None:
        transaccion.estadoTransaccion = "Completada"

    def cancelar(self, transaccion) -> None:
        transaccion.estadoTransaccion = "Cancelada"


class CompletadaState(TransactionState):
    def get_name(self) -> str:
        return "Completada"


class CanceladaState(TransactionState):
    def get_name(self) -> str:
        return "Cancelada"


def get_state_instance(name: str) -> TransactionState:
    states = {
        "pendiente": PendienteState(),
        "confirmada": ConfirmadaState(),
        "procesando": ProcesandoState(),
        "completada": CompletadaState(),
        "cancelada": CanceladaState(),
        
        "Pendiente": PendienteState(),
        "Confirmada": ConfirmadaState(),
        "Procesando": ProcesandoState(),
        "Completada": CompletadaState(),
        "Cancelada": CanceladaState(),
        "En preparacion": ProcesandoState(), # map DB's "En preparacion" to ProcesandoState
    }
    state = states.get(name)
    if not state:
        raise ValueError(f"Estado de transacción desconocido: '{name}'")
    return state
