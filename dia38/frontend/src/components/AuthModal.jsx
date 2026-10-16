import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const initialState = {
  name: '',
  email: '',
  password: '',
};

const AuthModal = ({ mode = 'login', onClose }) => {
  const { login, register, loading } = useAuth();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (currentMode === 'register' && !form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!form.email.trim() || !form.password.trim()) {
      setError('Correo y contraseña son obligatorios');
      return;
    }

    const action = currentMode === 'login' ? login : register;
    const payload = currentMode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    const result = await action(payload);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);
    setForm(initialState);
    setTimeout(onClose, 700);
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {currentMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="mb-4 flex rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setCurrentMode('login')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              currentMode === 'login' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentMode('register')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              currentMode === 'register' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentMode === 'register' && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-800 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Procesando...' : currentMode === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
