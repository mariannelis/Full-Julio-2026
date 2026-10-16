import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
const router = express.Router();
function response(user, message) { return { message, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email } }; }
router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6)
      return res.status(400).json({ message: 'Nombre (mínimo 2), correo válido y contraseña (mínimo 6) son obligatorios.' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'El correo ya está registrado.' });
    const user = await User.create({ name, email, password });
    return res.status(201).json(response(user, 'Cuenta creada correctamente.'));
  } catch (err) { next(err); }
});
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Introduce correo y contraseña.' });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Credenciales incorrectas.' });
    return res.json(response(user, 'Sesión iniciada.'));
  } catch (err) { next(err); }
});
export default router;
