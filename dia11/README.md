# Día 11 — Middlewares con Express.js

Solución de los tres niveles del ejercicio.

## Ejecutar

Requiere Node.js 18 o superior.

```bash
npm install
npm start
```

Abre `http://localhost:3000`.

## Middlewares implementados

- `logs.js`: imprime fecha, método y URL.
- `authorization.js`: exige un token en `Authorization` o `X-Auth-Token`.
- `request-counter.js`: cuenta e imprime todas las solicitudes.
- `response-time.js`: imprime el tiempo de procesamiento en milisegundos.
- `ip-blocker.js`: bloquea la IP configurada.
- `not-found.js`: transforma rutas inexistentes en errores 404.
- `server-error.js`: devuelve todos los errores en JSON.

## Probar con curl

Ruta pública:

```bash
curl http://localhost:3000/api/public
```

Sin token, responde `403`:

```bash
curl http://localhost:3000/api/protected
```

Con token, responde `200`:

```bash
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer token-de-prueba"
```

Simular la IP bloqueada:

```bash
curl http://localhost:3000/api/public \
  -H "X-Forwarded-For: 192.168.1.100"
```

Comprobar el manejo de errores:

```bash
curl http://localhost:3000/api/error
```

## Configuración opcional

Copia `.env.example` como `.env` o configura las variables desde el sistema:

```text
PORT=3000
BLOCKED_IP=192.168.1.100
```

## Pruebas automáticas

```bash
npm test
```
