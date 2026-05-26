# OptiLook

App para recomendar monturas según el tipo de rostro, junto con el manejo de clientes y transacciones para la compra de las monturas.

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

### Backend (sin Docker)
1. Entrar a `backend/`
2. Crear y activar entorno virtual
3. Instalar dependencias:
   - `pip install -r requirements.txt`
4. Ejecutar:
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

Healthcheck:
- `GET http://localhost:8000/api/v1/health`

### Frontend (sin Docker)
1. Entrar a `frontend/`
2. Instalar dependencias:
   - `npm install`
3. Ejecutar en modo desarrollo:
   - `npm run dev` (usa el puerto 3000)

Notas:
- El frontend intenta llamar al backend en `NEXT_PUBLIC_API_BASE_URL`.

### Desarrollo local (con Docker Compose)
Desde `infra/`:

```bash
docker compose up --build
```

Verificación:
- Backend: `http://localhost:8000/api/v1/health`
- Frontend: `http://localhost:3000`

## Despliegue
Consulta:
- `docs/deployment.md`
- `render.yaml`

El backend debe tener una URL pública accesible para que el frontend pueda consumirlo mediante `NEXT_PUBLIC_API_BASE_URL`.

## Integración de diseño (Figma -> frontend)
Guía en:
- `docs/figma-workflow.md`

Incluye convenciones de nombres, entrega del diseño y checklist para implementar UI en Next.js.

## Próximos pasos (no incluidos todavía)
- Modelado de base de datos y migraciones
- Endpoints para clientes y transacciones
- Conexión real del frontend con los endpoints (más allá del healthcheck)
