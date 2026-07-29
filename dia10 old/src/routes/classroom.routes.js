const express = require('express');
const service = require('../services/classroom.service');

const router = express.Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/full', asyncRoute(async (req, res) => {
  const classrooms = await service.list(req.query);
  res.json(await Promise.all(classrooms.map(service.expand)));
}));
router.get('/:id/full', asyncRoute(async (req, res) => res.json(await service.expand(await service.requireById(req.params.id)))));
router.get('/', asyncRoute(async (req, res) => res.json(await service.list(req.query))));
router.get('/:id', asyncRoute(async (req, res) => res.json(await service.requireById(req.params.id))));
router.post('/', asyncRoute(async (req, res) => res.status(201).json(await service.create(req.body))));
router.put('/:id', asyncRoute(async (req, res) => res.json(await service.update(req.params.id, req.body))));
router.delete('/:id', asyncRoute(async (req, res) => res.json({ message: 'Classroom eliminado', data: await service.remove(req.params.id) })));

module.exports = router;
