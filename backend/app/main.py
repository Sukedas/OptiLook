from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.routes.health import router as health_router
from app.api.v1.endpoints.clientes import router as clientes_router
from app.api.v1.endpoints.monturas import router as monturas_router
from app.api.v1.endpoints.transacciones import router as transacciones_router
from app.api.v1.endpoints.recomendaciones import router as recomendaciones_router
from app.api.v1.endpoints.auth import router as auth_router

from sqlalchemy import text
from app.core.database import SessionLocal
from app.services.cliente_service import hash_password_to_int

def run_db_migrations():
    print("[Migration] Running startup database migrations...")
    db = SessionLocal()
    try:
        # Check if column 'rol' exists in 'usuario' table
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuario' AND column_name = 'rol';
        """)).fetchone()
        
        if not result:
            print("[Migration] Column 'rol' not found in table 'usuario'. Adding it...")
            db.execute(text('ALTER TABLE "usuario" ADD COLUMN "rol" VARCHAR(255) NOT NULL DEFAULT \'cliente\';'))
            db.commit()
            print("[Migration] Column 'rol' added successfully.")
        else:
            print("[Migration] Column 'rol' already exists.")
            
        # Ensure default admin user exists
        admin_user = db.execute(text('SELECT * FROM "usuario" WHERE "correoUsuario" = \'admin@optilook.com\';')).fetchone()
        if not admin_user:
            print("[Seed] Seeding default admin user (admin@optilook.com)...")
            hashed_admin = hash_password_to_int("admin")
            db.execute(text("""
                INSERT INTO "usuario" (
                    "idUsuario", "idFormulaActual", "idTipo", "primerNombre", "segundoNombre",
                    "primerApellido", "segundoApellido", "correoUsuario", "fechaNacimiento",
                    "direccion", "hashContrasena", "rol"
                ) VALUES (
                    99, NULL, NULL, 'Admin', '', 'OptiLook', '', 'admin@optilook.com', '1990-01-01',
                    'Oficina Central', :hash_val, 'administrador'
                );
            """), {"hash_val": hashed_admin})
            db.commit()
            print("[Seed] Default admin user seeded successfully.")
            
        # Ensure Ana Gomez (idUsuario=1) is an admin for test convenience
        db.execute(text('UPDATE "usuario" SET "rol" = \'administrador\' WHERE "idUsuario" = 1;'))
        db.commit()
        print("[Seed] Verified Ana Gomez (idUsuario=1) is registered as administrator.")
            
    except Exception as e:
        print("\n" + "!"*80)
        print(" ⚠️  ERROR CRÍTICO: NO SE PUDO CONECTAR A LA BASE DE DATOS POSTGRESQL  ⚠️")
        print("!"*80)
        print("El backend de FastAPI no logró establecer conexión en: localhost:5432")
        print("\nEsto se debe a uno de los siguientes motivos comunes en tu sistema:")
        print(" 1. EL CONTENEDOR DE DOCKER O SERVICIO DE POSTGRESQL NO ESTÁ CORRIENDO:")
        print("    -> Si estás usando Docker (Recomendado), abre una terminal en la carpeta 'infra/'")
        print("       del proyecto y ejecuta el siguiente comando para levantar la base de datos:")
        print("       > docker compose up -d db")
        print("    -> Si instalaste PostgreSQL localmente en Windows, abre 'Servicios' en Windows")
        print("       y asegúrate de que el servicio 'postgresql-x64...' esté en estado 'En ejecución'.")
        print(" 2. LA BASE DE DATOS 'optilook' NO HA SIDO CREADA:")
        print("    -> Conéctate a tu Postgres local y asegúrate de crear la base de datos 'optilook'.")
        print("       Puedes ejecutar en SQL: CREATE DATABASE optilook;")
        print(" 3. CREDENCIALES INCORRECTAS:")
        print("    -> Verifica que el usuario sea 'postgres' y la contraseña sea 'postgres' en backend/.env.")
        print("\nDetalle técnico del error: " + str(e))
        print("!"*80 + "\n")
        db.rollback()
    finally:
        db.close()

from app.observers.event_publisher import event_publisher
from app.observers.stock_observer import StockObserver
from app.observers.notification_observer import NotificationObserver
from app.observers.audit_observer import AuditObserver

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- 0. Ejecutar migraciones automáticas ----
    run_db_migrations()

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
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
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
