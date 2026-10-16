import { useEffect, useState } from 'react';
import { fileToBase64 } from '../utils/fileToBase64';

const emptyForm = {
  title: '',
  content: '',
  image: '',
};

const PostForm = ({ onSubmit, initialValues = null, onCancel = null, submitting = false }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        content: initialValues.content || '',
        image: initialValues.image || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 3_000_000) {
      setError('Selecciona una imagen JPG, PNG, WEBP o GIF de máximo 3 MB.');
      return;
    }
    setError('');
    const base64 = await fileToBase64(file);
    setForm((prev) => ({ ...prev, image: base64 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.content.trim() || !form.image) {
      setError('Debes completar título, contenido e imagen');
      return;
    }

    const ok = await onSubmit(form);
    if (ok && !initialValues) {
      setForm(emptyForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {initialValues ? 'Editar publicación' : 'Crear publicación'}
        </h2>
        <p className="text-sm text-slate-500">La imagen es obligatoria y se guarda en Base64.</p>
      </div>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Título"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
      />

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Escribe tu publicación"
        rows="4"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {form.image && (
        <img src={form.image} alt="Vista previa" className="h-44 w-full rounded-xl object-cover" />
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {submitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Publicar'}
        </button>

        {initialValues && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
