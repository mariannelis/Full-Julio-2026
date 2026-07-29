require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const { verifyToken } = require("./middleware/auth.middleware");
const taskRouter = require("./routes/task.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/status", (_req, res) => {
  res.json({ message: "API de usuarios y tareas funcionando" });
});

app.use(authRoutes);
app.use("/items", verifyToken, taskRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "El ID no es válido" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: "Error interno del servidor" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar con MongoDB:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
