import { Link } from "react-router-dom";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <article className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${task.completed ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${task.completed ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"}`}>
              {task.completed ? "Completada" : "Pendiente"}
            </span>
            <span className="text-xs text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className={`mt-3 text-xl font-black ${task.completed ? "text-slate-500 line-through" : "text-slate-900"}`}>{task.title}</h3>
          <p className="mt-2 line-clamp-2 text-slate-500">{task.description}</p>
        </div>
        <button onClick={() => onToggle(task)} className={`shrink-0 rounded-xl px-3 py-2 text-sm font-bold ${task.completed ? "bg-white text-emerald-700" : "bg-slate-900 text-white"}`}>
          {task.completed ? "Reabrir" : "Completar"}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200/70 pt-4">
        <Link to={`/task/${task._id}`} className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-bold text-violet-700">Ver detalle</Link>
        <Link to={`/edit/${task._id}`} className="rounded-xl bg-sky-100 px-3 py-2 text-sm font-bold text-sky-700">Editar</Link>
        <button onClick={() => onDelete(task._id)} className="rounded-xl bg-rose-100 px-3 py-2 text-sm font-bold text-rose-700">Eliminar</button>
      </div>
    </article>
  );
}
