import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Register() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const navigate = useNavigate();

  const {
    register,
    isAuthenticated,
  } = useUser();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!email || !password || !confirmPassword) {
      alert("Completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register(email, password);

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#F4F0E8] px-5 py-10 dark:bg-[#18211D]">
      <section className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C76D4E]">
            Planifica. Organiza. Avanza.
          </p>

          <h1 className="mt-3 text-5xl font-black text-[#202521] dark:text-[#F4F0E8]">
            Organízate
          </h1>

          <p className="mt-3 text-[#68736C] dark:text-[#B8C1BB]">
            Crea tu cuenta y comienza a organizar tus tareas.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-[#DDD6C9] bg-[#FFFDF8] p-7 shadow-sm dark:border-[#36443C] dark:bg-[#222E28]"
        >
          <div>
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
          </div>

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
              placeholder="Mínimo 8 caracteres"
              required
              className="w-full border border-[#D4CCBF] bg-white px-4 py-3 outline-none transition focus:border-[#C76D4E] dark:border-[#46554C] dark:bg-[#18211D] dark:text-white"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-bold text-[#26372F] dark:text-[#F4F0E8]"
            >
              Confirmar contraseña
            </label>

            <input
              ref={confirmPasswordRef}
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              required
              className="w-full border border-[#D4CCBF] bg-white px-4 py-3 outline-none transition focus:border-[#C76D4E] dark:border-[#46554C] dark:bg-[#18211D] dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#26372F] px-5 py-3 font-bold text-[#FFFDF8] transition hover:bg-[#354A3E]"
          >
            Crear cuenta
          </button>

          <p className="mt-5 text-center text-sm text-[#68736C] dark:text-[#B8C1BB]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-bold text-[#C76D4E] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}