import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();

app.use(express.json());

const carpetaArchivos = path.resolve("archivos");

app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de gestión de archivos funcionando"
    });
});

app.get("/archivos/:nombre", async (req, res) => {
    try {
        const nombreArchivo = req.params.nombre;
        const rutaArchivo = path.join(carpetaArchivos, nombreArchivo);

        const contenido = await fs.readFile(rutaArchivo, "utf8");

        res.status(200).json({
            mensaje: "Archivo leído correctamente",
            nombre: nombreArchivo,
            contenido
        });
    } catch (error) {
        if (error.code === "ENOENT") {
            return res.status(404).json({
                mensaje: "El archivo no existe"
            });
        }

        res.status(500).json({
            mensaje: "Error al leer el archivo",
            error: error.message
        });
    }
});

app.post("/archivos", async (req, res) => {
    try {
        const { nombre, contenido } = req.body;

        if (!nombre || contenido === undefined) {
            return res.status(400).json({
                mensaje: "Los campos nombre y contenido son obligatorios"
            });
        }

        await fs.mkdir(carpetaArchivos, {
            recursive: true
        });

        const rutaArchivo = path.join(carpetaArchivos, nombre);

        await fs.writeFile(rutaArchivo, contenido, "utf8");

        res.status(201).json({
            mensaje: "Archivo creado correctamente",
            nombre,
            contenido
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el archivo",
            error: error.message
        });
    }
});

app.delete("/archivos/:nombre", async (req, res) => {
    try {
        const nombreArchivo = req.params.nombre;
        const rutaArchivo = path.join(carpetaArchivos, nombreArchivo);

        await fs.unlink(rutaArchivo);

        res.status(200).json({
            mensaje: "Archivo eliminado correctamente",
            nombre: nombreArchivo
        });
    } catch (error) {
        if (error.code === "ENOENT") {
            return res.status(404).json({
                mensaje: "El archivo no existe"
            });
        }

        res.status(500).json({
            mensaje: "Error al eliminar el archivo",
            error: error.message
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en http://localhost:${PORT}`);
});