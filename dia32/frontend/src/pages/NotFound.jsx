import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl"><div className="text-6xl">404</div><h2 className="mt-4 text-3xl font-black text-slate-900">Página no encontrada</h2><Link className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-3 font-bold text-white" to="/">Volver al inicio</Link></section>;
}
