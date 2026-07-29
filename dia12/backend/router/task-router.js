const express = require("express");
const Item = require("../models/item.model");

const router = express.Router();

// GET /items - Listar todas las tareas
router.get("/", async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// GET /items/:id - Obtener una tarea
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// POST /items - Crear una tarea
router.post("/", async (req, res, next) => {
  try {
    const { title, completed } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "El título es obligatorio"
      });
    }

    const item = await Item.create({
      title: title.trim(),
      completed: completed ?? false
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// PUT /items/:id - Actualizar una tarea
router.put("/:id", async (req, res, next) => {
  try {
    const changes = {};

    if (req.body.title !== undefined) {
      changes.title = req.body.title.trim();
    }

    if (req.body.completed !== undefined) {
      changes.completed = req.body.completed;
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      changes,
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// DELETE /items/:id - Eliminar una tarea
router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    res.json({
      message: "Tarea eliminada correctamente",
      item
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;