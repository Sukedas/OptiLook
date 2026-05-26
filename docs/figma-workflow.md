# Workflow de Figma -> Frontend (Next.js)

Este documento define una forma consistente de diseñar en Figma para que la implementación en `frontend/` sea rápida y predecible.

## 1. Estructura recomendada en Figma
Dentro del archivo de Figma:
- `DesignSystem/`:
  - Colores, tipografías y spacing (tokens)
  - Componentes atómicos y base (Button, Input, Modal, etc.)
- `Pages/`:
  - Pantallas finales (por ejemplo: `Login`, `Dashboard`, `Checkout`)
- `Components/`:
  - Componentes compuestos (por ejemplo: `MonturaCard`, `ClienteForm`)

Regla: el diseño de pantallas debe reutilizar componentes; evitar “frames” con estilos duplicados.

## 2. Convención de nombres (para evitar fricción al implementar)
Usa PascalCase para componentes y separa variantes con sufijos claros:
- `Button_Primary`
- `Button_Secondary`
- `Input_Default`
- `Modal_Confirm`

Para componentes compuestos:
- `ClienteCard`
- `TransaccionRow`

## 3. Tokens y escala de estilos
Define tokens para que el código no dependa de valores “hardcodeados”:
- `color.*` (por ejemplo: `color.background`, `color.text.primary`)
- `space.*` (por ejemplo: `space.1`, `space.2`, `space.4`)
- `font.*` (familia, tamaños, pesos)
- `radius.*`
- `shadow.*` (si aplica)

Objetivo: al implementar, mapear estilos a una fuente común (CSS variables / utilidades / tema).

## 4. Entrega del diseño (handoff)
Para cada pantalla, el diseñador debe dejar claro:
- Estados de componentes:
  - default / hover / disabled
  - error / loading / success (si aplica)
- Validaciones y mensajes:
  - textos, longitudes y ejemplos
- Comportamientos:
  - qué se oculta/muestra según flujo (por ejemplo: vacío vs con datos)

Checklist rápido antes de “handoff”:
- Todo componente usado en pantallas existe como componente en `Components/` o `DesignSystem/`.
- Existen variantes para estados relevantes.
- Se define el layout (Auto Layout y grid) de forma consistente.

## 5. Traducción a Next.js (guía práctica)
En `frontend/` (App Router):
- Pantallas -> `frontend/app/(ruta)/page.tsx`
- Componentes reutilizables -> `frontend/components/` (cuando migremos de la UI inicial)
- Layout compartido -> `frontend/app/layout.tsx`

Buenas prácticas de implementación:
- Mantener componentes “presentacionales” separados de la lógica (servicios de API).
- Para llamadas al backend, centralizar una capa simple (ej. `lib/api.ts`) cuando empiece la integración real.
- Respetar tamaños/spacing del diseño para reducir retrabajo.

## 6. Qué artefactos usar (si tu equipo tiene Figma2Code / Code Connect)
Si en algún momento quieren automatizar el mapeo:
- Preferir que los componentes tengan nombres estables.
- Evitar renombrar variantes con frecuencia.
- Asegurar que los estilos usen tokens antes de exportar.

## 7. Estado actual del repositorio
En esta fase inicial el frontend solo muestra el `healthcheck` del backend:
- Backend: `GET /api/v1/health`

Cuando el diseño de pantallas esté listo, se reemplazará la UI inicial por las pantallas reales.
