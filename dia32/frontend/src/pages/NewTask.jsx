import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { useTasks } from "../contexts/TaskContext";

export default function NewTask() {
  const { createTask } = useTasks();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(values) {
    setBusy(true);
    try {
      const task = await createTask(values);
      navigate(`/task/${task._id}`);
    } catch (err) {
      alert(err.message);
    } finally { setBusy(false); }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-8">
  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C76D4E]">
    Añade algo nuevo a tu día
  </p>

  <h1 className="mt-3 text-4xl font-black tracking-tight text-[#202521] dark:text-[#F4F0E8]">
    Nueva tarea
  </h1>

  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#68736C] dark:text-[#B8C1BB]">
    Completa los campos para crear una nueva tarea.
  </p>
</div>
      <TaskForm onSubmit={submit} busy={busy} submitLabel="Agregar tarea" />
    </section>
  );
}
