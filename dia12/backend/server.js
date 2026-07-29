require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRouter = require("./router/task-router");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API de tareas funcionando"
  });
});

app.use("/items", taskRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "El ID no es válido"
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: error.message
    });
  }

  res.status(500).json({
    error: "Error interno del servidor"
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("No se pudo conectar con MongoDB:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();