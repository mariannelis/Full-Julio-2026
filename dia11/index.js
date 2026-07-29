const path = require('node:path');
const express = require('express');
const logger = require('./middlewares/logs');
const authorization = require('./middlewares/authorization');
const { requestCounter, getRequestCount } = require('./middlewares/request-counter');
const responseTime = require('./middlewares/response-time');
const createIpBlocker = require('./middlewares/ip-blocker');
const notFound = require('./middlewares/not-found');
const serverError = require('./middlewares/server-error');

const app = express();
const PORT = process.env.PORT || 3000;
const BLOCKED_IP = process.env.BLOCKED_IP || '192.168.1.100';

// Permite reconocer X-Forwarded-For cuando la aplicación está tras un proxy.
app.set('trust proxy', 1);

// Middlewares generales: se ejecutan en cada solicitud y en este orden.
app.use(logger);
app.use(requestCounter);
app.use(responseTime);
app.use(createIpBlocker(BLOCKED_IP));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/public', (_req, res) => {
  res.json({ message: 'Ruta pública', requests: getRequestCount() });
});

app.get('/api/protected', authorization, (_req, res) => {
  res.json({ message: 'Usuario autenticado correctamente' });
});

// Ruta didáctica para comprobar el middleware de errores.
app.get('/api/error', (_req, _res, next) => {
  next(new Error('Error de prueba controlado por el middleware'));
});

app.use(notFound);
app.use(serverError);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;
