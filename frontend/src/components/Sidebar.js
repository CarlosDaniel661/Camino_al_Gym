import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const active = (p) => location.pathname === p ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <aside
      className="hidden md:flex flex-col fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] p-6 bg-white dark:bg-gray-800 border-r overflow-auto z-40 transition-colors duration-300"
      aria-label="Menú principal"
    >
      <div className="flex flex-col items-center mb-6">
        <img src="/profile.jpg" alt="Perfil" className="w-24 h-24 rounded-full object-cover shadow-md" />
        <h3 className="mt-3 font-semibold text-gray-800 dark:text-gray-100">Camino al Gym</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Superación · Disciplina · Constancia · Exito</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link to="/" className={`px-3 py-2 rounded-lg ${active("/")}`}>Inicio</Link>
        <Link to="/sobre-mi" className={`px-3 py-2 rounded-lg ${active("/sobre-mi")}`}>Sobre mí</Link>
        <Link to="/servicios" className={`px-3 py-2 rounded-lg ${active("/servicios")}`}>Servicios</Link>
        <Link to="/contacto" className={`px-3 py-2 rounded-lg ${active("/contacto")}`}>Contacto</Link>
        <Link to="/reservar" className={`px-3 py-2 rounded-lg ${active("/reservar")}`}>Reservas</Link>
      </nav>
    </aside>
  );
}
