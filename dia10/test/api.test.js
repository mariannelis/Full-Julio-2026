const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(() => server.close());

test('lista personas y permite filtrar por nombre', async () => {
  const response = await fetch(`${baseUrl}/api/persons?name=ana`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.length, 1);
  assert.equal(data[0].surname, 'García');
});

test('expande profesor y estudiantes del aula', async () => {
  const response = await fetch(`${baseUrl}/api/classrooms/1/full`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.teacher.id, '1');
  assert.deepEqual(data.students.map(student => student.id), ['2', '3']);
});

test('rechaza un id de persona repetido', async () => {
  const response = await fetch(`${baseUrl}/api/persons`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: 1, name: 'Otra', surname: 'Persona', isTeacher: false, birthdate: '2000-01-01' })
  });
  assert.equal(response.status, 409);
});
