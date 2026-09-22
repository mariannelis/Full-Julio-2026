import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useUser();

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F4F0E8] px-5 dark:bg-[#18211D]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C76D4E]">
            Organízate
          </p>
          <p className="mt-3 font-bold text-[#26372F] dark:text-[#F4F0E8]">
            Comprobando sesión...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
