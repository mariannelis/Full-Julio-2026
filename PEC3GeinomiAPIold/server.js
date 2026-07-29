require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Servidor Geinomi funcionando en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error iniciando el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
