const app = require("../src/app");
const connectDB = require("../src/config/db");
const logger = require("../src/utils/logger");

connectDB().catch((error) => {
  logger.error(`Error conectando en Vercel: ${error.message}`);
});

module.exports = app;
