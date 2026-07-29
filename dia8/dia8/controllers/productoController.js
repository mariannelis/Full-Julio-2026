import Producto from "../models/Producto.js";

export const crearProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            producto
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear el producto",
            error: error.message
        });
    }
};

export const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.find();

        res.status(200).json({
            cantidad: productos.length,
            productos
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los productos",
            error: error.message
        });
    }
};

export const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            producto
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "ID de producto no válido",
            error: error.message
        });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al actualizar el producto",
            error: error.message
        });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al eliminar el producto",
            error: error.message
        });
    }
};