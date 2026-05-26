# Despliegue (Render y Railway)

Este documento describe una ruta inicial para desplegar el backend (FastAPI) y el frontend (Next.js).

## Requisitos
1. Tener una base de datos Postgres accesible (local o administrada).
2. Configurar variables de entorno:
   - `DATABASE_URL` (backend)
   - `NEXT_PUBLIC_API_BASE_URL` (frontend)

## Variables de entorno recomendadas

### Backend
- `PORT`: puerto en el contenedor/servicio (por defecto `8000`)
- `DATABASE_URL`: cadena de conexión a Postgres
- `CORS_ORIGINS`: orígenes permitidos (opcional en esta versión inicial)

### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: URL pública del backend, p. ej. `https://tu-backend.onrender.com`

## Render (deploy recomendado para empezar)

1. Crea un “Web Service” para el backend.
   - Path raíz: `backend/`
   - Comando de inicio: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Healthcheck: `GET /api/v1/health`
2. Crea un “Web Service” para el frontend.
   - Path raíz: `frontend/`
   - Build: `npm install && npm run build`
   - Start: `npm run start`
3. En cada servicio, define las variables:
   - Backend: `DATABASE_URL`, `PORT` (si aplica)
   - Frontend: `NEXT_PUBLIC_API_BASE_URL`

Si Render utiliza `render.yaml` en tu configuración, puedes usar el blueprint incluido en la raíz: `render.yaml`. Verifica y ajusta campos según tu cuenta/configuración.

## Railway (deploy vía Docker)

1. Despliega el backend con su `Dockerfile` en `backend/Dockerfile`.
2. Despliega el frontend con su `Dockerfile` en `frontend/Dockerfile`.
3. Configura en Railway:
   - Backend: `PORT` (si hace falta), `DATABASE_URL`
   - Frontend: `NEXT_PUBLIC_API_BASE_URL` apuntando al dominio del backend

## Despliegue local con Docker Compose

1. Desde `infra/`, levanta todo:

```bash
docker compose up --build
```

2. Verifica:
   - Backend: `http://localhost:8000/api/v1/health`
   - Frontend: `http://localhost:3000`
