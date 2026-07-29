const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');
const { resetRequestCount } = require('../middlewares/request-counter');

let server;
let baseUrl;

test.before(async () => {
  resetRequestCount();
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(() => server.close());

test('la ruta protegida devuelve 403 cuando no hay token', async () => {
  const response = await fetch(`${baseUrl}/api/protected`);
  assert.equal(response.status, 403);
});

test('la ruta protegida acepta un token', async () => {
  const response = await fetch(`${baseUrl}/api/protected`, {
    headers: { authorization: 'Bearer token-de-prueba' }
  });
  assert.equal(response.status, 200);
});

test('el contador aumenta con cada solicitud', async () => {
  const response = await fetch(`${baseUrl}/api/public`);
  const body = await response.json();
  assert.ok(body.requests >= 3);
});

test('bloquea la IP configurada', async () => {
  const response = await fetch(`${baseUrl}/api/public`, {
    headers: { 'x-forwarded-for': '192.168.1.100' }
  });
  assert.equal(response.status, 403);
});

test('captura errores y responde JSON', async () => {
  const response = await fetch(`${baseUrl}/api/error`);
  assert.equal(response.status, 500);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const body = await response.json();
  assert.equal(body.error, 'Internal Server Error');
});

test('una ruta inexistente devuelve 404 en JSON', async () => {
  const response = await fetch(`${baseUrl}/no-existe`);
  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type'), /application\/json/);
});
