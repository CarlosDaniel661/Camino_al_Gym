import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaServicestack, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: FaHome, label: "Inicio" },
    { path: "/about", icon: FaUser, label: "Sobre mí" },
    { path: "/services", icon: FaServicestack, label: "Servicios" },
    { path: "/contact", icon: FaEnvelope, label: "Contacto" },
    { path: "/reserve", icon: FaCalendarAlt, label: "Reservas" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              isActive(path)
                ? "active"
                : "hover:opacity-75"
            }`}
            aria-label={label}
          >
            <Icon className="text-lg mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}