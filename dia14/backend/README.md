# Día 14 — Usuarios, JWT y tareas

Aplicación completa con registro de usuarios, login, JWT en `localStorage` y CRUD de tareas persistidas en MongoDB.

## Ejecutar

Requiere MongoDB local activo.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Endpoints

| Método | Ruta | Acción |
|---|---|---|
| POST | `/register` | Registrar un usuario |
| POST | `/login` | Iniciar sesión y generar JWT |
| GET | `/verify` | Verificar el token |
| GET | `/items` | Listar tareas protegidas |
| GET | `/items/:id` | Leer una tarea protegida |
| POST | `/items` | Crear una tarea protegida |
| PUT | `/items/:id` | Actualizar una tarea protegida |
| DELETE | `/items/:id` | Eliminar una tarea protegida |

Las rutas de tareas requieren `Authorization: Bearer <token>`.
