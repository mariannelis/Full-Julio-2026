import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../contexts/TaskContext";

export default function TaskDetail() {
  const { id } = useParams();
  const { getTask, loading, refreshTasks, toggleTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const task = getTask(id);

  useEffect(() => { if (!task && !loading) refreshTasks(); }, [task, loading, refreshTasks]);

  if (loading && !task) return <div className="rounded-2xl bg-violet-50 p-5 text-violet-700">Cargando detalle...</div>;
  if (!task) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">Tarea no encontrada.</div>;

  async function remove() {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await deleteTask(id);
    navigate("/");
  }

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Información de la tarea</p>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${task.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{task.completed ? "Completada" : "Pendiente"}</span>
      </div>
      <h2 className="mt-4 text-4xl font-black text-slate-900">{task.title}</h2>
      <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-slate-600">{task.description}</p>
      <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
        <p>Creada: {new Date(task.createdAt).toLocaleString()}</p>
        <p>Actualizada: {new Date(task.updatedAt).toLocaleString()}</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        <button onClick={() => toggleTask(id, !task.completed)} className="rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white">{task.completed ? "Marcar pendiente" : "Completar"}</button>
        <Link to={`/edit/${id}`} className="rounded-xl bg-sky-100 px-4 py-3 font-bold text-sky-700">Editar</Link>
        <button onClick={remove} className="rounded-xl bg-rose-100 px-4 py-3 font-bold text-rose-700">Eliminar</button>
        <Link to="/" className="rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-600">Volver</Link>
      </div>
    </section>
  );
}
