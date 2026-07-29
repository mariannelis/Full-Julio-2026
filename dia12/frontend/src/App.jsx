import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/items";

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ha ocurrido un error");
  }

  return data;
}

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(API_URL);
      setItems(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function createItem(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Escribe una tarea");
      return;
    }

    try {
      setError("");

      const newItem = await apiRequest(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false
        })
      });

      setItems((currentItems) => [
        newItem,
        ...currentItems
      ]);

      setTitle("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function toggleItem(item) {
    try {
      setError("");

      const updatedItem = await apiRequest(
        `${API_URL}/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            completed: !item.completed
          })
        }
      );

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem._id === updatedItem._id
            ? updatedItem
            : currentItem
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteItem(id) {
    try {
      setError("");

      await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      setItems((currentItems) =>
        currentItems.filter((item) => item._id !== id)
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="container">
      <section className="task-card">
        <header>
          <p className="eyebrow">Día 12 · Express + React</p>
          <h1>Mis tareas</h1>
          <p className="subtitle">
            Organiza y completa tus actividades.
          </p>
        </header>

        <form className="task-form" onSubmit={createItem}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Escribe una nueva tarea"
            aria-label="Nueva tarea"
          />

          <button type="submit">
            Agregar
          </button>
        </form>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {loading ? (
          <p className="empty-message">Cargando tareas...</p>
        ) : items.length === 0 ? (
          <p className="empty-message">
            Todavía no tienes tareas.
          </p>
        ) : (
          <ul className="task-list">
            {items.map((item) => (
              <li
                className={item.completed ? "completed" : ""}
                key={item._id}
              >
                <button
                  className="check-button"
                  type="button"
                  onClick={() => toggleItem(item)}
                  aria-label="Cambiar estado"
                >
                  {item.completed ? "✓" : ""}
                </button>

                <span>{item.title}</span>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteItem(item._id)}
                  aria-label="Eliminar tarea"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;