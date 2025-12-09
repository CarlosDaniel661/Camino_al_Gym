import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <p className="text-sm">© {new Date().getFullYear()} Camino al Gym. Todos los derechos reservados.</p>

        <nav className="flex space-x-4 mt-4 md:mt-0" aria-label="Footer navigation">
          <Link to="/about" className="hover:text-blue-400">Sobre mí</Link>
          <Link to="/services" className="hover:text-blue-400">Servicios</Link>
          <Link to="/contact" className="hover:text-blue-400">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
}
