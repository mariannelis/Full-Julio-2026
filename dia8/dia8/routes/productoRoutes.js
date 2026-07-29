import express from "express";

import {
    crearProducto,
    listarProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
} from "../controllers/productoController.js";

const router = express.Router();

router.post("/", crearProducto);

router.get("/", listarProductos);

router.get("/:id", obtenerProductoPorId);

router.put("/:id", actualizarProducto);

router.delete("/:id", eliminarProducto);

export default router;