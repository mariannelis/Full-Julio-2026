import { NavLink, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

const navClass = ({ isActive }) =>
  `rounded-xl px-4 py-2.5 text-sm font-bold transition ${
    isActive ? "bg-violet-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Layout() {
  const { user, logout } = useUser();

  const { theme, toggleTheme } = useTheme();
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-100 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">Planifica. Organiza. Avanza.</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">Organízate</h1>
              <p className="mt-3 max-w-2xl text-slate-500">Todo lo que tienes que hacer, en un solo lugar.</p>
            </div>
            <div className="flex items-center gap-3">
  <button
    onClick={toggleTheme}
    className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
  >
    {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
  </button>

  <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
      Usuario
    </p>

    <p className="font-bold text-slate-800 dark:text-white">
      {user.email}
    </p>

    <p className="text-xs text-slate-400">
      ID: {user.id}
    </p>
    <button
    onClick={logout}
    className="mt-2 text-xs font-bold text-[#C76D4E] hover:underline"
  >
    Cerrar sesión
  </button>
  </div>
</div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
            <NavLink to="/" end className={navClass}>Tareas</NavLink>
            <NavLink to="/new-task" className={navClass}>+ Nueva tarea</NavLink>
          </nav>
        </header>

        <Outlet />

        <footer className="mt-12 text-center text-sm text-slate-400">Organízate · Gestión de tareas personales · 2026</footer>
      </div>
    </main>
  );
}
