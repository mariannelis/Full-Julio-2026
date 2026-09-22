import { useRef } from "react";

export default function TaskForm({ initialTask, onSubmit, submitLabel = "Guardar tarea", busy = false }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const title = titleRef.current?.value.trim() || "";
    const description = descriptionRef.current?.value.trim() || "";

    if (!title || !description) {
      alert("Completa el título y la descripción.");
      return;
    }

    await onSubmit({ title, description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
      <div>
        <label htmlFor="title" className="mb-2 block font-bold text-slate-700">Título</label>
        <input ref={titleRef} id="title" defaultValue={initialTask?.title || ""} placeholder="Ej. Preparar entrega final" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block font-bold text-slate-700">Descripción</label>
        <textarea ref={descriptionRef} id="description" defaultValue={initialTask?.description || ""} rows="6" placeholder="Describe la tarea..." className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
      </div>

      <button disabled={busy} className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
