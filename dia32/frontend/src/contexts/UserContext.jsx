import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function readSession() {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      setUser(null);
      return null;
    }

    const data = await response.json();
    setUser(data);
    return data;
  }

  useEffect(() => {
    async function checkSession() {
      try {
        localStorage.removeItem("organizate-user");
        await readSession();
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    checkSession();
  }, []);

  async function register(email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "No se pudo crear la cuenta.");
    }

    const sessionUser = await readSession();

    if (!sessionUser) {
      throw new Error(
        "La cuenta se creó, pero no se pudo establecer la sesión."
      );
    }

    return sessionUser;
  }

  async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "No se pudo iniciar sesión.");
    }

    const sessionUser = await readSession();

    if (!sessionUser) {
      throw new Error(
        "No se pudo establecer la sesión. Intenta iniciar sesión nuevamente."
      );
    }

    return sessionUser;
  }

  async function logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isAuthenticated: Boolean(user),
        authLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
