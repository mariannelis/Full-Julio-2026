
import dns from 'node:dns';
import mongoose from 'mongoose';

// Usar servidores DNS públicos para resolver MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Reutilizar la conexión en Vercel
const cache = globalThis.__blogMongoose ||
  (globalThis.__blogMongoose = {
    connection: null,
    promise: null
  });

export async function connectDB() {
  if (cache.connection && mongoose.connection.readyState === 1) {
    return cache.connection;
  }

  if (!cache.promise) {
    const uri =
      process.env.MONGODB_URI_STANDARD ||
      process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('Falta configurar la conexión MongoDB en .env');
    }

    cache.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
  }

  try {
    cache.connection = await cache.promise;
    console.log('Conexión exitosa a MongoDB');
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    cache.connection = null;
    console.error('Error al conectar con MongoDB:', error.message);
    throw error;
  }
}
