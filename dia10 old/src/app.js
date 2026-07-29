const express = require("express");
const personRoutes = require("routes/persons.routes");

const app = express();

app.use(express.json());

app.get("", (req, res) => {
  res.json({
    message: "Servidor funcionando correctamente"
  });
});

app.use("/api/persons", personRoutes);

module.exports = app;