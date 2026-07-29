const express = require("express");
const config = require("./config");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: config.appName,
    message: config.appMessage,
    environment: config.environment,
    server: {
      host: config.host,
      port: config.port
    }
  });
});

app.get("/config", (req, res) => {
  res.json(config);
});

app.listen(config.port, config.host, () => {
  console.log("-----------------------------------");
  console.log(`Aplicación: ${config.appName}`);
  console.log(`Entorno: ${config.environment}`);
  console.log(
    `Servidor: http://${config.host}:${config.port}`
  );
  console.log("-----------------------------------");
});