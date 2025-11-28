import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b z-50 flex items-center justify-between px-4 md:px-8 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3">
        <img src="/profile.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">Camino al Gym</Link>
      </div>

      <nav className="hidden md:flex gap-6 items-center">
        <Link to="/reservar" className="hover:text-blue-600 dark:hover:text-blue-400">Reservas</Link>
        <Link to="/contacto" className="hover:text-blue-600 dark:hover:text-blue-400">Contacto</Link>
        <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">Admin</Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* Mobile small icon/profile visible on right */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
