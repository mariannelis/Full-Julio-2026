import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "./UserContext";

const TaskContext = createContext(null);
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Error al conectar con la API");
  }

  return data;
}

export function TaskProvider({ children }) {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshTasks = useCallback(async () => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await request("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  async function createTask(payload) {
    const task = await request("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setTasks((current) => [task, ...current]);
    return task;
  }

  async function updateTask(id, payload) {
    const task = await request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    setTasks((current) =>
      current.map((item) => (item._id === id ? task : item))
    );

    return task;
  }

  async function toggleTask(id, completed) {
    const task = await request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });

    setTasks((current) =>
      current.map((item) => (item._id === id ? task : item))
    );

    return task;
  }

  async function deleteTask(id) {
    await request(`/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks((current) =>
      current.filter((item) => item._id !== id)
    );
  }

  const getTask = useCallback(
    (id) => tasks.find((task) => task._id === id),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        refreshTasks,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        getTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
