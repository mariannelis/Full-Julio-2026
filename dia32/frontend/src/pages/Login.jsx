import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
  } = useUser();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("Completa el correo y la contraseña.");
      return;
    }

    try {
      await login(email, password);

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#F4F0E8] px-5 dark:bg-[#18211D]">
      <section className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C76D4E]">
            Planifica. Organiza. Avanza.
          </p>

          <h1 className="mt-3 text-5xl font-black text-[#202521] dark:text-[#F4F0E8]">
            Organízate
          </h1>

          <p className="mt-3 text-[#68736C] dark:text-[#B8C1BB]">
            Accede a tus tareas y mantén tu día bajo control.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-[#DDD6C9] bg-[#FFFDF8] p-7 shadow-sm dark:border-[#36443C] dark:bg-[#222E28]"
        >
          <label
            htmlFor="email"
            className="mb-2 block font-bold text-[#26372F] dark:text-[#F4F0E8]"
          >
            Correo electrónico
          </label>

          <input
            ref={emailRef}
            id="email"
            type="email"
            placeholder="nombre@correo.com"
            required
            className="w-full border border-[#D4CCBF] bg-white px-4 py-3 outline-none transition focus:border-[#C76D4E] dark:border-[#46554C] dark:bg-[#18211D] dark:text-white"
          />

          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-2 block font-bold text-[#26372F] dark:text-[#F4F0E8]"
            >
              Contraseña
            </label>

            <input
              ref={passwordRef}
              id="password"
              type="password"
              placeholder="Introduce tu contraseña"
              required
              className="w-full border border-[#D4CCBF] bg-white px-4 py-3 outline-none transition focus:border-[#C76D4E] dark:border-[#46554C] dark:bg-[#18211D] dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-[#26372F] px-5 py-3 font-bold text-[#FFFDF8] transition hover:bg-[#354A3E]"
          >
            Iniciar sesión
          </button>

          <p className="mt-5 text-center text-sm text-[#68736C] dark:text-[#B8C1BB]">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-bold text-[#C76D4E] hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}