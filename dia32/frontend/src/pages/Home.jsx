import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../contexts/TaskContext";

export default function Home() {
  const { tasks, loading, error, toggleTask, deleteTask, refreshTasks } = useTasks();
  const [localTasks, setLocalTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "completed") return localTasks.filter((task) => task.completed);
    if (filter === "pending") return localTasks.filter((task) => !task.completed);
    return localTasks;
  }, [localTasks, filter]);

  async function handleToggle(task) {
    await toggleTask(task._id, !task.completed);
  }

  async function handleDelete(id) {
    if (confirm("¿Eliminar esta tarea?")) await deleteTask(id);
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mt-1 text-3xl font-black text-slate-900">Lista de tareas</h2>
          <p className="mt-2 text-slate-500">Consulta tus tareas, actualiza su estado y mantén el control de tu día a dia</p>
        </div>
        <Link to="/new-task" className="w-fit rounded-xl bg-violet-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-violet-700">+ Agregar tarea</Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {[['all', 'Todas'], ['pending', 'Pendientes'], ['completed', 'Completadas']].map(([value, label]) => (
          <button key={value} onClick={() => setFilter(value)} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${filter === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
            <div className="text-5xl">✅</div>
          <h3 className="mt-4 text-xl font-black text-slate-800">No hay tareas en esta vista</h3>
          <p className="mt-2 text-slate-500">Crea una tarea nueva o cambia el filtro.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTasks.map((task) => <TaskCard key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />)}
      </div>
    </section>
  );
}
