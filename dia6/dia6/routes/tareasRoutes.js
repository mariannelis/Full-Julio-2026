const express = require("express");
const router = express.Router();
const Tarea = require("../models/Tarea");

// Crear una tarea
router.post("/", async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    const tareaGuardada = await nuevaTarea.save();

    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la tarea", error });
  }
});

// Ver todas las tareas
router.get("/", async (req, res) => {
  try {
    const tareas = await Tarea.find();

    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las tareas", error });
  }
});

// Ver una tarea por ID
router.get("/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la tarea", error });
  }
});

// Editar una tarea
router.put("/:id", async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tareaActualizada) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar la tarea", error });
  }
});

// Borrar una tarea
router.delete("/:id", async (req, res) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);

    if (!tareaEliminada) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al borrar la tarea", error });
  }
});

module.exports = router;