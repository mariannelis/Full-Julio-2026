import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
function readSession() {
  try { return JSON.parse(localStorage.getItem('blog_auth') || 'null'); }
  catch { localStorage.removeItem('blog_auth'); return null; }
}
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [loading, setLoading] = useState(false);
  const save = data => {
    const next = { token: data.token, user: data.user };
    localStorage.setItem('blog_auth', JSON.stringify(next));
    setSession(next);
  };
  const action = async (path, payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(path, payload);
      save(data);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'No se pudo conectar con el servidor' };
    } finally { setLoading(false); }
  };
  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    loading,
    isAuthenticated: Boolean(session?.token),
    login: payload => action('/auth/login', payload),
    register: payload => action('/auth/register', payload),
    logout: () => { localStorage.removeItem('blog_auth'); setSession(null); },
  }), [session, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
