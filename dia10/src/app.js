const express = require('express');
const personRouter = require('./routes/person.routes');
const classroomRouter = require('./routes/classroom.routes');
const { HttpError } = require('./utils/http-error');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'API Express Router + CSV',
    endpoints: {
      persons: '/api/persons',
      classrooms: '/api/classrooms',
      expandedClassrooms: '/api/classrooms/full'
    }
  });
});

app.use('/api/persons', personRouter);
app.use('/api/classrooms', classroomRouter);

app.use((_req, _res, next) => next(new HttpError(404, 'Ruta no encontrada')));

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  if (status === 500) console.error(error);
  res.status(status).json({ error: error.message || 'Error interno del servidor' });
});

module.exports = app;
