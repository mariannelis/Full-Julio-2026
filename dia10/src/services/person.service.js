const path = require('node:path');
const { CsvStore } = require('../utils/csv-store');
const { HttpError } = require('../utils/http-error');

const store = new CsvStore(
  path.join(__dirname, '../../data/persons.csv'),
  ['id', 'name', 'surname', 'isTeacher', 'birthdate'],
  row => ({ ...row, isTeacher: row.isTeacher === 'true' })
);

function nextId(records) {
  return String(Math.max(0, ...records.map(record => Number(record.id) || 0)) + 1);
}

function validate(body, partial = false) {
  const required = ['name', 'surname', 'isTeacher', 'birthdate'];
  if (!partial) {
    const missing = required.filter(field => body[field] === undefined || body[field] === '');
    if (missing.length) throw new HttpError(400, `Campos obligatorios: ${missing.join(', ')}`);
  }
  if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
    throw new HttpError(400, 'name debe ser un texto no vacío');
  }
  if (body.surname !== undefined && (typeof body.surname !== 'string' || !body.surname.trim())) {
    throw new HttpError(400, 'surname debe ser un texto no vacío');
  }
  if (body.isTeacher !== undefined && typeof body.isTeacher !== 'boolean') {
    throw new HttpError(400, 'isTeacher debe ser booleano');
  }
  if (body.birthdate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(body.birthdate)) {
    throw new HttpError(400, 'birthdate debe usar el formato YYYY-MM-DD');
  }
}

async function list(filters = {}) {
  const records = await store.readAll();
  const allowed = ['id', 'name', 'surname', 'isTeacher', 'birthdate'];
  return records.filter(record => allowed.every(field => {
    if (filters[field] === undefined) return true;
    return String(record[field]).toLowerCase().includes(String(filters[field]).toLowerCase());
  }));
}

async function getById(id) {
  return (await store.readAll()).find(person => person.id === String(id));
}

async function requireById(id) {
  const person = await getById(id);
  if (!person) throw new HttpError(404, `No existe la persona con id ${id}`);
  return person;
}

async function create(body) {
  validate(body);
  const records = await store.readAll();
  const id = body.id === undefined ? nextId(records) : String(body.id);
  if (!id.trim()) throw new HttpError(400, 'El id no puede estar vacío');
  if (records.some(person => person.id === id)) throw new HttpError(409, `El id ${id} ya existe`);
  const person = {
    id,
    name: body.name.trim(),
    surname: body.surname.trim(),
    isTeacher: body.isTeacher,
    birthdate: body.birthdate
  };
  records.push(person);
  await store.writeAll(records);
  return person;
}

async function update(id, body) {
  validate(body, true);
  const records = await store.readAll();
  const index = records.findIndex(person => person.id === String(id));
  if (index === -1) throw new HttpError(404, `No existe la persona con id ${id}`);
  const allowed = ['name', 'surname', 'isTeacher', 'birthdate'];
  const changes = Object.fromEntries(
    allowed.filter(key => body[key] !== undefined).map(key => [key, body[key]])
  );
  if (changes.name !== undefined) changes.name = changes.name.trim();
  if (changes.surname !== undefined) changes.surname = changes.surname.trim();
  records[index] = { ...records[index], ...changes, id: records[index].id };
  await store.writeAll(records);
  return records[index];
}

async function remove(id) {
  const records = await store.readAll();
  const index = records.findIndex(person => person.id === String(id));
  if (index === -1) throw new HttpError(404, `No existe la persona con id ${id}`);
  const [deleted] = records.splice(index, 1);
  await store.writeAll(records);
  return deleted;
}

module.exports = { list, getById, requireById, create, update, remove };
