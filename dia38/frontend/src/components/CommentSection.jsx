import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, comments = [], onCreate, onUpdate, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const ok = await onCreate(postId, newComment);
    if (ok) setNewComment('');
  };

  const handleUpdate = async (id) => {
    if (!editingText.trim()) return;
    const ok = await onUpdate(id, editingText);
    if (ok) {
      setEditingId(null);
      setEditingText('');
    }
  };

  return (
    <div className="space-y-4 rounded-xl bg-slate-50 p-4">
      <div>
        <h4 className="font-semibold text-slate-800">Comentarios ({comments.length})</h4>
      </div>

      {comments.length === 0 && <p className="text-sm text-slate-500">Todavía no hay comentarios.</p>}

      <div className="space-y-3">
        {comments.map((comment) => {
          const isOwner = user?.id === comment.author?._id || user?.id === comment.author?.id;
          return (
            <div key={comment._id} className="rounded-lg bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{comment.author?.name || 'Usuario'}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditingText(comment.content);
                      }}
                      className="text-xs font-medium text-amber-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment._id ? (
                <div className="space-y-2">
                  <textarea
                    rows="3"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(comment._id)}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText('');
                      }}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-700">{comment.content}</p>
              )}
            </div>
          );
        })}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleCreate} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            placeholder="Escribe un comentario"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Comentar
          </button>
        </form>
      ) : (
        <p className="text-sm text-slate-500">Inicia sesión para comentar.</p>
      )}
    </div>
  );
};

export default CommentSection;
