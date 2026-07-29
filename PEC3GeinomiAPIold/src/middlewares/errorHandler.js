const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || res.statusCode || 500;

  logger.error(`${statusCode} - ${error.message}`);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: error.message || "Error interno del servidor"
  });
};

module.exports = errorHandler;
