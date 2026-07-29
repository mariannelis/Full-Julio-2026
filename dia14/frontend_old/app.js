const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const verifyButton = document.querySelector("#verify-button");
const logoutButton = document.querySelector("#logout-button");
const sessionStatus = document.querySelector("#session-status");
const message = document.querySelector("#message");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-title");
const taskSubmit = document.querySelector("#task-submit");
const taskHelp = document.querySelector("#task-help");
const taskList = document.querySelector("#task-list");
const menuButtons = document.querySelectorAll(".menu-button");
const viewSections = document.querySelectorAll(
  "main.container > section.card"
);

function showSection(sectionIndex) {
  viewSections.forEach((section, index) => {
    section.hidden = index !== sectionIndex;
  });

  menuButtons.forEach((button, index) => {
    button.classList.toggle("active", index === sectionIndex);
  });
}

menuButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showSection(index);
  });
});

showSection(0);

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = type;
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ha ocurrido un error");
  }

  return data;
}

function tokenHeaders(withJson = false) {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  if (withJson) headers["Content-Type"] = "application/json";
  return headers;
}

function updateSessionUi(email = "") {
  const logged = Boolean(email);
  sessionStatus.textContent = logged
    ? `Estás logueado como ${email}`
    : "No estás logueado";
  taskInput.disabled = !logged;
  taskSubmit.disabled = !logged;
  taskHelp.textContent = logged
    ? "Tus cambios se guardan en MongoDB."
    : "Inicia sesión para administrar tus tareas.";
  if (!logged) taskList.replaceChildren();
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);

  try {
    const data = await request("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    showMessage(data.message);
    registerForm.reset();
    showSection(1);
  } catch (error) {
    showMessage(error.message, "error");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    const data = await request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    localStorage.setItem("token", data.token);
    updateSessionUi(data.user.email);
    showMessage(data.message);
    loginForm.reset();
    await loadTasks();
    showSection(3);
  } catch (error) {
    showMessage(error.message, "error");
  }
});

async function verifySession() {
  const token = localStorage.getItem("token");
  if (!token) {
    updateSessionUi();
    return false;
  }

  try {
    const data = await request("/verify", {
      headers: tokenHeaders()
    });
    updateSessionUi(data.user.email);
    return true;
  } catch (error) {
    localStorage.removeItem("token");
    updateSessionUi();
    showMessage(error.message, "error");
    return false;
  }
}

verifyButton.addEventListener("click", async () => {
  if (await verifySession()) {
    showMessage("Token verificado correctamente");
    await loadTasks();
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  updateSessionUi();
  showMessage("Sesión cerrada correctamente");
  showSection(1);
});

function renderTasks(items) {
  taskList.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-task";
    empty.textContent = "Todavía no tienes tareas.";
    taskList.append(empty);
    return;
  }

  items.forEach((item) => {
    const entry = document.createElement("li");
    if (item.completed) entry.classList.add("completed");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "task-check";
    toggle.textContent = item.completed ? "✓" : "";
    toggle.addEventListener("click", () => toggleTask(item));

    const title = document.createElement("span");
    title.textContent = item.title;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "task-delete";
    remove.textContent = "Eliminar";
    remove.addEventListener("click", () => deleteTask(item._id));

    entry.append(toggle, title, remove);
    taskList.append(entry);
  });
}

async function loadTasks() {
  try {
    renderTasks(await request("/items", { headers: tokenHeaders() }));
  } catch (error) {
    showMessage(error.message, "error");
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await request("/items", {
      method: "POST",
      headers: tokenHeaders(true),
      body: JSON.stringify({ title: taskInput.value.trim() })
    });
    taskForm.reset();
    showMessage("Tarea creada correctamente");
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

async function toggleTask(item) {
  try {
    await request(`/items/${item._id}`, {
      method: "PUT",
      headers: tokenHeaders(true),
      body: JSON.stringify({ completed: !item.completed })
    });
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function deleteTask(id) {
  try {
    await request(`/items/${id}`, {
      method: "DELETE",
      headers: tokenHeaders()
    });
    showMessage("Tarea eliminada correctamente");
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

verifySession().then((logged) => {
  if (logged) loadTasks();
});
