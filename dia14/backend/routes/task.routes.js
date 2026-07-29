const express = require("express");
const Item = require("../models/item.model");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Item.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const item = await Item.create({ title: title.trim() });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const changes = {};
    if (req.body.title !== undefined) changes.title = req.body.title;
    if (req.body.completed !== undefined) changes.completed = req.body.completed;

    const item = await Item.findByIdAndUpdate(req.params.id, changes, {
      new: true,
      runValidators: true
    });

    if (!item) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json({ message: "Tarea eliminada correctamente", item });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
