import { useEffect, useState } from 'react';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';

function App() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudieron cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (values) => {
    try {
      setSavingPost(true);
      const { data } = await api.post('/posts', values);
      setPosts((prev) => [{ ...data, comments: [] }, ...prev]);
      setMessage('Publicación creada correctamente');
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo crear la publicación');
      return false;
    } finally {
      setSavingPost(false);
    }
  };

  const updatePost = async (postId, values) => {
    try {
      const { data } = await api.put(`/posts/${postId}`, values);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, ...data, comments: post.comments }
            : post
        )
      );
      setMessage('Publicación actualizada correctamente');
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo actualizar la publicación');
      return false;
    }
  };

  const deletePost = async (postId) => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta publicación?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setMessage('Publicación eliminada correctamente');
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo eliminar la publicación');
    }
  };

  const createComment = async (postId, content) => {
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content });
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, data] }
            : post
        )
      );
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo crear el comentario');
      return false;
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      const { data } = await api.put(`/comments/${commentId}`, { content });
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          comments: post.comments.map((comment) => (comment._id === commentId ? data : comment)),
        }))
      );
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo actualizar el comentario');
      return false;
    }
  };

  const deleteComment = async (commentId) => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar este comentario?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          comments: post.comments.filter((comment) => comment._id !== commentId),
        }))
      );
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo eliminar el comentario');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onOpenAuth={setModalMode} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-10 text-white shadow-lg">
          <h2 className="text-3xl font-bold">Proyecto Blog Fullstack</h2>
          <p className="mt-2 max-w-3xl text-slate-200">
            Los visitantes pueden leer publicaciones y comentarios. Los usuarios autenticados pueden crear,
            editar y eliminar sus publicaciones y comentarios.
          </p>
        </section>

        {message && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            {isAuthenticated ? (
              <PostForm onSubmit={createPost} submitting={savingPost} />
            ) : (
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800">¿Quieres participar?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Regístrate o inicia sesión para crear publicaciones y comentar.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setModalMode('login')}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => setModalMode('register')}
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Registrarme
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">Cargando publicaciones...</div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">No hay publicaciones todavía.</div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdatePost={updatePost}
                  onDeletePost={deletePost}
                  onCreateComment={createComment}
                  onUpdateComment={updateComment}
                  onDeleteComment={deleteComment}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {modalMode && <AuthModal mode={modalMode} onClose={() => setModalMode(null)} />}
    </div>
  );
}

export default App;
