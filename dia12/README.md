# Día 12 — Express + React + MongoDB

Aplicación de tareas con frontend en React, API REST en Express y persistencia en MongoDB.

## Requisitos

- Node.js 18 o superior.
- MongoDB local ejecutándose en `mongodb://127.0.0.1:27017`.

## Backend

```bash
cd backend
npm install
npm run dev
```

Disponible en `http://localhost:3000`.

| Método | Ruta | Acción |
|---|---|---|
| GET | `/items` | Listar todas las tareas |
| GET | `/items/:id` | Obtener una tarea |
| POST | `/items` | Crear una tarea |
| PUT | `/items/:id` | Actualizar una tarea |
| DELETE | `/items/:id` | Eliminar una tarea |

## Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

Desde la interfaz se pueden crear, completar y eliminar tareas. Los cambios permanecen después de actualizar la página porque se guardan en MongoDB.
