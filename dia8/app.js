import express from "express";
import productoRoutes from "./routes/productoRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "Bienvenido a la API de productos, usuarios y pedidos"
    });
});

app.use("/api/productos", productoRoutes);

export default app;