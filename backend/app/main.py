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
from app.core.database import SessionLocal, Base, engine
from app.services.cliente_service import hash_password_to_int
from datetime import date
from decimal import Decimal

# Import all models to register them on Base.metadata
from app.models.cliente import Cliente, TipoRostro, Formula
from app.models.montura import Montura, Material
from app.models.transaccion import Transaccion, TransaccionDetalle
from app.models.recomendacion import Recomendacion

def run_db_migrations():
    print("[Migration] Running startup database migrations...")
    
    # 1. Crear todas las tablas si no existen en Postgres
    try:
        Base.metadata.create_all(bind=engine)
        print("[Migration] Base de datos: Tablas verificadas/creadas con éxito.")
    except Exception as e:
        print(f"[Migration] Advertencia al verificar/crear tablas: {e}")
        
    db = SessionLocal()
    try:
        # 2. Sembrar datos semilla si están vacíos
        
        # 2.1 Sembrar Materiales
        material_count = db.query(Material).count()
        if material_count == 0:
            print("[Seed] Sembrando tabla 'material'...")
            materials = [
                Material(idMaterial=1, nombreMaterial='Acetato'),
                Material(idMaterial=2, nombreMaterial='Metal'),
                Material(idMaterial=3, nombreMaterial='Titanio'),
                Material(idMaterial=4, nombreMaterial='TR90'),
                Material(idMaterial=5, nombreMaterial='Madera'),
                Material(idMaterial=6, nombreMaterial='Aluminio'),
                Material(idMaterial=7, nombreMaterial='Acero inoxidable'),
                Material(idMaterial=8, nombreMaterial='Fibra de carbono'),
                Material(idMaterial=9, nombreMaterial='Nylon'),
                Material(idMaterial=10, nombreMaterial='Policarbonato')
            ]
            db.add_all(materials)
            db.commit()
            print("[Seed] Tabla 'material' sembrada.")

        # 2.2 Sembrar Tipos de Rostro
        face_count = db.query(TipoRostro).count()
        if face_count == 0:
            print("[Seed] Sembrando tabla 'tipoRostro'...")
            faces = [
                TipoRostro(idTipo=1, nombreTipo='Ovalado', descripcionTipo='Rostro equilibrado con proporciones suaves', imagenTipo='ovalado.png'),
                TipoRostro(idTipo=2, nombreTipo='Redondo', descripcionTipo='Contornos curvos y ancho similar al alto', imagenTipo='redondo.png'),
                TipoRostro(idTipo=3, nombreTipo='Cuadrado', descripcionTipo='Mandibula marcada y frente amplia', imagenTipo='cuadrado.png'),
                TipoRostro(idTipo=4, nombreTipo='Corazon', descripcionTipo='Frente amplia y menton estrecho', imagenTipo='corazon.png'),
                TipoRostro(idTipo=5, nombreTipo='Diamante', descripcionTipo='Pometulos prominentes y frente estrecha', imagenTipo='diamante.png'),
                TipoRostro(idTipo=6, nombreTipo='Alargado', descripcionTipo='Rostro mas largo que ancho', imagenTipo='alargado.png'),
                TipoRostro(idTipo=7, nombreTipo='Triangular', descripcionTipo='Mandibula ancha y frente estrecha', imagenTipo='triangular.png'),
                TipoRostro(idTipo=8, nombreTipo='Rectangular', descripcionTipo='Similar al cuadrado pero mas largo', imagenTipo='rectangular.png'),
                TipoRostro(idTipo=9, nombreTipo='Hexagonal', descripcionTipo='Lineas angulosas y equilibrio general', imagenTipo='hexagonal.png'),
                TipoRostro(idTipo=10, nombreTipo='Piriforme', descripcionTipo='Frente estrecha y mandibula amplia', imagenTipo='piriforme.png')
            ]
            db.add_all(faces)
            db.commit()
            print("[Seed] Tabla 'tipoRostro' sembrada.")

        # 2.3 Sembrar Monturas
        montura_count = db.query(Montura).count()
        if montura_count == 0:
            print("[Seed] Sembrando tabla 'montura'...")
            monturas = [
                Montura(idMontura=1, idMaterial=1, nombreMontura='Classic Oval', imagenMontura='classic_oval.png', stockMontura=18, colorMontura='Negro', generoMontura='Unisex', precioMontura=Decimal('189900.00')),
                Montura(idMontura=2, idMaterial=2, nombreMontura='Urban Round', imagenMontura='urban_round.png', stockMontura=12, colorMontura='Dorado', generoMontura='Unisex', precioMontura=Decimal('219900.00')),
                Montura(idMontura=3, idMaterial=3, nombreMontura='Pro Square', imagenMontura='pro_square.png', stockMontura=10, colorMontura='Plata', generoMontura='Hombre', precioMontura=Decimal('249900.00')),
                Montura(idMontura=4, idMaterial=4, nombreMontura='Light Fit', imagenMontura='light_fit.png', stockMontura=25, colorMontura='Azul', generoMontura='Mujer', precioMontura=Decimal('169900.00')),
                Montura(idMontura=5, idMaterial=5, nombreMontura='Eco Wood', imagenMontura='eco_wood.png', stockMontura=8, colorMontura='Cafe', generoMontura='Unisex', precioMontura=Decimal('279900.00')),
                Montura(idMontura=6, idMaterial=6, nombreMontura='Soft Frame', imagenMontura='soft_frame.png', stockMontura=15, colorMontura='Rojo', generoMontura='Mujer', precioMontura=Decimal('199900.00')),
                Montura(idMontura=7, idMaterial=7, nombreMontura='Edge Line', imagenMontura='edge_line.png', stockMontura=14, colorMontura='Verde', generoMontura='Hombre', precioMontura=Decimal('239900.00')),
                Montura(idMontura=8, idMaterial=8, nombreMontura='Neo Slim', imagenMontura='neo_slim.png', stockMontura=9, colorMontura='Gris', generoMontura='Unisex', precioMontura=Decimal('259900.00')),
                Montura(idMontura=9, idMaterial=9, nombreMontura='Flex Wave', imagenMontura='flex_wave.png', stockMontura=20, colorMontura='Negro', generoMontura='Mujer', precioMontura=Decimal('179900.00')),
                Montura(idMontura=10, idMaterial=10, nombreMontura='Nature Bold', imagenMontura='nature_bold.png', stockMontura=6, colorMontura='Marron', generoMontura='Hombre', precioMontura=Decimal('289900.00'))
            ]
            db.add_all(monturas)
            db.commit()
            print("[Seed] Tabla 'montura' sembrada.")

        # 2.4 Sembrar Clientes
        user_count = db.query(Cliente).count()
        if user_count == 0:
            print("[Seed] Sembrando tabla 'usuario' con clientes por defecto...")
            clients = [
                Cliente(idUsuario=1, primerNombre='Ana', segundoNombre='Lucia', primerApellido='Gomez', segundoApellido='Perez', correoUsuario='ana.gomez@example.com', fechaNacimiento=date(1998, 3, 14), direccion='Calle 10 # 15-20', hashContrasena=1234567890, rol='administrador'),
                Cliente(idUsuario=2, primerNombre='Carlos', segundoNombre='Andres', primerApellido='Ramirez', segundoApellido='Lopez', correoUsuario='carlos.ramirez@example.com', fechaNacimiento=date(1995, 7, 22), direccion='Avenida 5 # 8-30', hashContrasena=2345678901, rol='cliente'),
                Cliente(idUsuario=3, primerNombre='Maria', segundoNombre='Fernanda', primerApellido='Torres', segundoApellido='Diaz', correoUsuario='maria.torres@example.com', fechaNacimiento=date(2000, 11, 5), direccion='Carrera 12 # 45-18', hashContrasena=3456789012, rol='cliente'),
                Cliente(idUsuario=4, primerNombre='Jorge', segundoNombre='Ivan', primerApellido='Martinez', segundoApellido='Sanchez', correoUsuario='jorge.martinez@example.com', fechaNacimiento=date(1992, 1, 28), direccion='Calle 24 # 9-11', hashContrasena=4567890123, rol='cliente'),
                Cliente(idUsuario=5, primerNombre='Laura', segundoNombre='Valentina', primerApellido='Castro', segundoApellido='Rojas', correoUsuario='laura.castro@example.com', fechaNacimiento=date(1997, 9, 16), direccion='Transversal 3 # 22-40', hashContrasena=5678901234, rol='cliente'),
                Cliente(idUsuario=6, primerNombre='Diego', segundoNombre='Alejandro', primerApellido='Vargas', segundoApellido='Moreno', correoUsuario='diego.vargas@example.com', fechaNacimiento=date(1994, 4, 9), direccion='Diagonal 7 # 30-25', hashContrasena=6789012345, rol='cliente'),
                Cliente(idUsuario=7, primerNombre='Sofia', segundoNombre='Isabel', primerApellido='Ortiz', segundoApellido='Herrera', correoUsuario='sofia.ortiz@example.com', fechaNacimiento=date(2001, 12, 21), direccion='Calle 18 # 6-14', hashContrasena=7890123456, rol='cliente'),
                Cliente(idUsuario=8, primerNombre='Mateo', segundoNombre='Emilio', primerApellido='Navarro', segundoApellido='Cruz', correoUsuario='mateo.navarro@example.com', fechaNacimiento=date(1999, 6, 3), direccion='Avenida 9 # 17-56', hashContrasena=8901234567, rol='cliente'),
                Cliente(idUsuario=9, primerNombre='Camila', segundoNombre='Patricia', primerApellido='Mendoza', segundoApellido='Gil', correoUsuario='camila.mendoza@example.com', fechaNacimiento=date(1996, 10, 30), direccion='Carrera 4 # 11-07', hashContrasena=9012345678, rol='cliente'),
                Cliente(idUsuario=10, primerNombre='Sebastian', segundoNombre='David', primerApellido='Pena', segundoApellido='Flores', correoUsuario='sebastian.pena@example.com', fechaNacimiento=date(1993, 2, 12), direccion='Calle 31 # 2-19', hashContrasena=1122334455, rol='cliente')
            ]
            db.add_all(clients)
            db.commit()
            print("[Seed] Tabla 'usuario' sembrada.")

        # 3. Verificar/Migrar columna 'rol' en tabla 'usuario' (por si existía y no tenía la columna)
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
            
        # 4. Asegurar usuario Administrador por defecto
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
            
        # Asegurar Ana Gomez (idUsuario=1) es admin
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
