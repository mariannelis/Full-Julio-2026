const mongoose = require("mongoose");
const logger = require("../utils/logger");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info("MongoDB ya estaba conectado");
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  try {
    const connection = await mongoose.connect(uri);

    isConnected = true;

    logger.info(`MongoDB Atlas conectado: ${connection.connection.name}`);

    return connection;
  } catch (error) {
    logger.error(`Error conectando a MongoDB Atlas: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;