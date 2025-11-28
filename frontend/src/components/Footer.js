import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-8 bg-gray-900 text-gray-100 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">© {new Date().getFullYear()} Camino al Gym. Todos los derechos reservados.</div>

        <nav className="flex gap-4">
          <Link to="/sobre-mi" className="hover:text-blue-300">Sobre mí</Link>
          <Link to="/servicios" className="hover:text-blue-300">Servicios</Link>
          <Link to="/contacto" className="hover:text-blue-300">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
}
