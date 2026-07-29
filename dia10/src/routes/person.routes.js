const express = require('express');
const service = require('../services/person.service');

const router = express.Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/', asyncRoute(async (req, res) => res.json(await service.list(req.query))));
router.get('/:id', asyncRoute(async (req, res) => res.json(await service.requireById(req.params.id))));
router.post('/', asyncRoute(async (req, res) => res.status(201).json(await service.create(req.body))));
router.put('/:id', asyncRoute(async (req, res) => res.json(await service.update(req.params.id, req.body))));
router.delete('/:id', asyncRoute(async (req, res) => res.json({ message: 'Persona eliminada', data: await service.remove(req.params.id) })));

module.exports = router;
