const path = require("path");
const dotenv = require("dotenv");

const environment = process.env.NODE_ENV || "development";
const envFile = path.resolve(__dirname, `.env.${environment}`);

const result = dotenv.config({ path: envFile });

if (result.error) {
  console.error(`No se pudo cargar ${envFile}`);
  process.exit(1);
}

const environmentConfig = require("config");

const config = {
  environment,
  host: environmentConfig.get("server.host"),
  port:
    Number(process.env.PORT) ||
    environmentConfig.get("server.port"),
  appName: environmentConfig.get("app.name"),
  appMessage: environmentConfig.get("app.message")
};

module.exports = config;