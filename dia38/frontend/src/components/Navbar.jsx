import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenAuth }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog Fullstack</h1>
          <p className="text-sm text-slate-500">Publicaciones con autenticación, imágenes y comentarios</p>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
