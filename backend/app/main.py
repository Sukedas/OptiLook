from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.routes.health import router as health_router
from app.api.v1.endpoints.clientes import router as clientes_router
from app.api.v1.endpoints.monturas import router as monturas_router
from app.api.v1.endpoints.transacciones import router as transacciones_router
from app.api.v1.endpoints.recomendaciones import router as recomendaciones_router

from app.observers.event_publisher import event_publisher
from app.observers.stock_observer import StockObserver
from app.observers.notification_observer import NotificationObserver
from app.observers.audit_observer import AuditObserver

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- 1. Registrar observadores en el EventPublisher ----
    stock_obs = StockObserver()
    notif_obs = NotificationObserver()
    audit_obs = AuditObserver()
    
    # Evento de creación
    event_publisher.subscribe("transaction_created", stock_obs)
    event_publisher.subscribe("transaction_created", notif_obs)
    event_publisher.subscribe("transaction_created", audit_obs)
    
    # Evento de cambio de estado
    event_publisher.subscribe("transaction_state_changed", stock_obs)
    event_publisher.subscribe("transaction_state_changed", notif_obs)
    event_publisher.subscribe("transaction_state_changed", audit_obs)
    
    # Evento de recomendaciones
    event_publisher.subscribe("recommendation_generated", notif_obs)
    event_publisher.subscribe("recommendation_generated", audit_obs)
    
    print("[Lifespan] Todos los observadores del patrón Observer han sido registrados.")
    
    yield
    # Limpiar observadores al apagar la app
    event_publisher.unsubscribe("transaction_created", stock_obs)
    event_publisher.unsubscribe("transaction_created", notif_obs)
    event_publisher.unsubscribe("transaction_created", audit_obs)
    
    event_publisher.unsubscribe("transaction_state_changed", stock_obs)
    event_publisher.unsubscribe("transaction_state_changed", notif_obs)
    event_publisher.unsubscribe("transaction_state_changed", audit_obs)
    
    event_publisher.unsubscribe("recommendation_generated", notif_obs)
    event_publisher.unsubscribe("recommendation_generated", audit_obs)
    
    print("[Lifespan] Observadores desuscritos con éxito.")

# Crear la aplicación FastAPI con ciclo de vida
app = FastAPI(title="OptiLook API", lifespan=lifespan)

# Configurar middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar enrutadores (Routers)
app.include_router(health_router, prefix="/api/v1")
app.include_router(clientes_router, prefix="/api/v1/clientes", tags=["Clientes"])
app.include_router(monturas_router, prefix="/api/v1/monturas", tags=["Monturas"])
app.include_router(transacciones_router, prefix="/api/v1/transacciones", tags=["Transacciones"])
app.include_router(recomendaciones_router, prefix="/api/v1/recomendaciones", tags=["Recomendaciones"])

@app.get("/")
def root():
    return {
        "name": "OptiLook API",
        "version": "1.0.0",
        "description": "API Fullstack de OptiLook para recomendación de monturas y gestión comercial"
    }
