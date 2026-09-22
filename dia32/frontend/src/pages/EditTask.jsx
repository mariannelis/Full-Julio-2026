import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { useTasks } from "../contexts/TaskContext";

export default function EditTask() {
  const { id } = useParams();
  const { getTask, updateTask, refreshTasks, loading } = useTasks();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const task = getTask(id);

  useEffect(() => { if (!task && !loading) refreshTasks(); }, [task, loading, refreshTasks]);

  if (loading && !task) return <div className="rounded-2xl bg-violet-50 p-5 text-violet-700">Cargando tarea...</div>;
  if (!task) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">Tarea no encontrada.</div>;

  async function submit(values) {
    setBusy(true);
    try {
      await updateTask(id, { ...values, completed: task.completed });
      navigate(`/task/${id}`);
    } catch (err) { alert(err.message); }
    finally { setBusy(false); }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Ruta /edit/:id · Formulario con useRef</p>
      <h2 className="mb-6 mt-1 text-3xl font-black text-slate-900">Editar tarea</h2>
      <TaskForm initialTask={task} onSubmit={submit} busy={busy} submitLabel="Guardar cambios" />
    </section>
  );
}
