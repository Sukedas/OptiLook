# OptiLook

App para recomendar monturas según el tipo de rostro, junto con el manejo de clientes y transacciones para la compra de las monturas.

## Requerimientos Funcionales 
- Registro y gestión de usuarios.
- Almacenamiento de información personal y fórmulas ópticas.
- Carga de fórmulas de optometría en formato digital.
- Gestión de tipos de rostro.
- Registro y administración de monturas.
- Gestión de materiales de monturas.
- Generación de recomendaciones de monturas según el tipo de rostro.
- Almacenamiento del historial de recomendaciones.
- Gestión de compras y transacciones.
- Control de inventario de monturas.

--- ## Instalación y Configuración

Este repositorio es un monorepo con:
- Backend en `FastAPI` (Python)
- Frontend en `Next.js` (React)
- Diseño de UI en `Figma` (guía incluida en `docs/`)
- Preparación de despliegue (Render/Railway) y levantamiento local (Docker Compose)

## Tecnologías
- Backend: `FastAPI`
- Frontend: `Next.js` (App Router)
- Infra local: `Docker Compose` + `PostgreSQL`

## Estructura del repositorio
- `backend/`: API FastAPI, endpoints base y configuración.
- `frontend/`: app Next.js y UI inicial.
- `docs/`: documentación (incluye workflow de Figma y despliegue).
- `infra/`: configuración de despliegue/infra compartida (por ejemplo, `docker-compose.yml`).
- `render.yaml`: blueprint para Render (puede requerir ajuste según tu cuenta/configuración).

## Requisitos
1. Python 3.12+ (para backend)
2. Node.js 20+ (para frontend)
3. (Opcional) Docker Desktop + Docker Compose (para desarrollo local consistente)

## Variables de entorno
Nunca commitees secretos. Usa los archivos `.env.example` como plantilla.

1. Copia el template raíz:
   - `.env.example` -> `.env`
2. Copia los templates por servicio si vas a ejecutar sin Docker:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.example` -> `frontend/.env`

Archivos:
- `.env.example`
- `backend/.env.example`
- `frontend/.env.example`

Variables relevantes:
- `DATABASE_URL` (backend)
- `NEXT_PUBLIC_API_BASE_URL` (frontend)

## Desarrollo local

Sigue estos pasos paso a paso para levantar tanto el backend como el frontend en tu máquina local.

### 🔌 Variables de Entorno (Paso 0)

1. En la raíz de tu espacio de trabajo, crea los archivos de entorno locales:
   - Copia `/backend/.env.example` a `/backend/.env`
   - Copia `/frontend/.env.example` a `/frontend/.env`

2. Asegúrate de configurar la variable `DATABASE_URL` en `/backend/.env` con las credenciales de tu PostgreSQL. Ejemplo:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/optilook
   PORT=8000
   CORS_ORIGINS=http://localhost:3000,http://localhost:8000
   ```

3. En `/frontend/.env`, verifica que `NEXT_PUBLIC_API_BASE_URL` apunte a tu backend local:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

---

### 🐍 Ejecución del Backend (FastAPI)

1. **Entrar al directorio del Backend**:
   ```bash
   cd backend
   ```

2. **Crear y activar un entorno virtual**:
   - En **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - En **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```
   *Nota: Esto instalará automáticamente FastAPI, Uvicorn, SQLAlchemy, psycopg2-binary y email-validator.*

4. **Ejecutar el servidor local**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Verificación**:
   - Healthcheck: `GET http://localhost:8000/api/v1/health`
   - Documentación Interactiva (Swagger UI): `http://localhost:8000/docs`

---

### ⚛️ Ejecución del Frontend (Next.js 14)

1. **Entrar al directorio del Frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Verificación**:
   - Abre tu navegador en `http://localhost:3000` para acceder a la suite administrativa interactiva y realizar diagnósticos geométricos de rostro.

---

### 🐳 Ejecución Consistente (con Docker Compose)

Si tienes Docker Desktop iniciado y prefieres levantar todos los servicios en contenedores aislados:

1. **Entrar al directorio de infraestructura**:
   ```bash
   cd infra
   ```

2. **Levantar contenedores**:
   ```bash
   docker compose up --build
   ```

3. **Verificación**:
   - Frontend Dashboard: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

---

## 🚀 Hoja de Ruta del Proyecto (Completada)

- [x] **Modelado de Base de Datos**: Mapeo completo en SQLAlchemy de tablas PostgreSQL preexistentes (`usuario`, `montura`, `transaccion`, `requiere`, etc.).
- [x] **Patrones de Diseño GoF**: Implementación estricta de **DAO**, **DTO**, **Strategy**, **State**, **Observer**, **Factory Method** y **Facade** en backend.
- [x] **Endpoints Completos**: CRUD de Clientes con soft-delete, catálogo de Monturas con restricción de aumentos, Transacciones con máquina de estados y motor de Recomendaciones.
- [x] **Conexión Frontend-Backend**: Flujos de compra, cambio de estados inline, diagnósticos vectoriales de rostro y sincronización automática de stock con React Query v5.
- [ ] Implementación de pasarela de pagos real.
- [ ] Carga automatizada de PDF oftálmico con OCR (reconocimiento óptico).


## Diagrama Entidad-Relación

El diagrama entidad-relación del sistema puede consultarse en el siguiente archivo:

[Diagrama Entidad-Relación]
<img width="1600" height="955" alt="Diagrama Entidad Relación" src="https://github.com/user-attachments/assets/1f9725dc-ebe4-41fe-88f7-3eceebd1eb7b" />


También puede visualizarse directamente desde el repositorio de GitHub.

---

## Integrantes del Grupo

| Integrante          | Rol                               |
| ------------------- | --------------------------------- |
| Edward Garcia       | Diseño de Base de Datos           |
| Julian Cabrera      | Modelo Entidad-Relación           |
| Daniel Presiga      | Procedimientos, Vistas y Triggers |
| Jaider Carvajal     | Documentación y Pruebas           |

---

## Tecnologías Utilizadas

* PostgreSQL
* SQL
* pgAdmin 4
* Git
* GitHub
* Python
* TypeScript
