import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'API del blog funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  const badInput = error.name === 'ValidationError' || error.name === 'CastError';
  res.status(badInput ? 400 : (error.statusCode || 500)).json({ message: badInput ? 'Datos inválidos.' : 'Error interno del servidor' });
});

export default app;
