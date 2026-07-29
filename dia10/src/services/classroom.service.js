const path = require('node:path');
const { CsvStore } = require('../utils/csv-store');
const { HttpError } = require('../utils/http-error');
const persons = require('./person.service');

const store = new CsvStore(
  path.join(__dirname, '../../data/classrooms.csv'),
  ['id', 'name', 'teacher_id', 'students'],
  row => ({ ...row, students: row.students ? row.students.split('|').filter(Boolean) : [] }),
  row => ({ ...row, students: row.students.join('|') })
);

function nextId(records) {
  return String(Math.max(0, ...records.map(record => Number(record.id) || 0)) + 1);
}

async function validate(body, partial = false) {
  const required = ['name', 'teacher_id', 'students'];
  if (!partial) {
    const missing = required.filter(field => body[field] === undefined || body[field] === '');
    if (missing.length) throw new HttpError(400, `Campos obligatorios: ${missing.join(', ')}`);
  }
  if (body.students !== undefined && !Array.isArray(body.students)) {
    throw new HttpError(400, 'students debe ser un array de ids');
  }
  if (body.teacher_id !== undefined) {
    const teacher = await persons.requireById(body.teacher_id);
    if (!teacher.isTeacher) throw new HttpError(400, `La persona ${body.teacher_id} no está marcada como profesor`);
  }
  if (body.students !== undefined) {
    const ids = body.students.map(String);
    if (new Set(ids).size !== ids.length) throw new HttpError(400, 'students contiene ids repetidos');
    await Promise.all(ids.map(id => persons.requireById(id)));
  }
}

async function list(filters = {}) {
  const records = await store.readAll();
  return records.filter(record => {
    if (filters.id !== undefined && !record.id.toLowerCase().includes(String(filters.id).toLowerCase())) return false;
    if (filters.name !== undefined && !record.name.toLowerCase().includes(String(filters.name).toLowerCase())) return false;
    if (filters.teacher_id !== undefined && record.teacher_id !== String(filters.teacher_id)) return false;
    if (filters.student_id !== undefined && !record.students.includes(String(filters.student_id))) return false;
    return true;
  });
}

async function getById(id) {
  return (await store.readAll()).find(classroom => classroom.id === String(id));
}

async function requireById(id) {
  const classroom = await getById(id);
  if (!classroom) throw new HttpError(404, `No existe el classroom con id ${id}`);
  return classroom;
}

async function expand(classroom) {
  return {
    id: classroom.id,
    name: classroom.name,
    teacher: await persons.requireById(classroom.teacher_id),
    students: await Promise.all(classroom.students.map(id => persons.requireById(id)))
  };
}

async function create(body) {
  await validate(body);
  const records = await store.readAll();
  const id = body.id === undefined ? nextId(records) : String(body.id);
  if (!id.trim()) throw new HttpError(400, 'El id no puede estar vacío');
  if (records.some(classroom => classroom.id === id)) throw new HttpError(409, `El id ${id} ya existe`);
  const classroom = { id, name: body.name.trim(), teacher_id: String(body.teacher_id), students: body.students.map(String) };
  records.push(classroom);
  await store.writeAll(records);
  return classroom;
}

async function update(id, body) {
  await validate(body, true);
  const records = await store.readAll();
  const index = records.findIndex(classroom => classroom.id === String(id));
  if (index === -1) throw new HttpError(404, `No existe el classroom con id ${id}`);
  const allowed = ['name', 'teacher_id', 'students'];
  const changes = Object.fromEntries(allowed.filter(key => body[key] !== undefined).map(key => [key, body[key]]));
  if (changes.teacher_id !== undefined) changes.teacher_id = String(changes.teacher_id);
  if (changes.students !== undefined) changes.students = changes.students.map(String);
  records[index] = { ...records[index], ...changes, id: records[index].id };
  await store.writeAll(records);
  return records[index];
}

async function remove(id) {
  const records = await store.readAll();
  const index = records.findIndex(classroom => classroom.id === String(id));
  if (index === -1) throw new HttpError(404, `No existe el classroom con id ${id}`);
  const [deleted] = records.splice(index, 1);
  await store.writeAll(records);
  return deleted;
}

module.exports = { list, requireById, expand, create, update, remove };
