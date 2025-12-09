import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const location = useLocation();
  const [profile, setProfile] = useState({ profile_main_url: "/profile.jpg" });

  useEffect(() => {
    axios.get("/api/admin/profile").then(r => {
      if (r.data && r.data.profile_main_url) setProfile(r.data);
    }).catch(()=>{});
  }, []);

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg mb-2 transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
    }`;

  return (
    <aside
      className="w-56 border-r p-4 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto sidebar"
      style={{ 
        backgroundColor: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)'
      }}
      role="navigation"
      aria-label="Sidebar"
    >
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile.profile_main_url || "/profile.jpg"}
          alt="Project profile"
          className="w-24 h-24 rounded-full object-cover shadow profile-img profile-focus-safe"
          style={{ objectPosition: "center" }}
        />
        <h3 
          className="mt-3 font-semibold"
          style={{ color: 'var(--sidebar-text)' }}
        >
          Camino al Gym
        </h3>
      </div>

      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkClass("/")}>Inicio</Link>
        <Link to="/about" className={linkClass("/about")}>Sobre mí</Link>
        <Link to="/services" className={linkClass("/services")}>Servicios</Link>
        <Link to="/contact" className={linkClass("/contact")}>Contacto</Link>
        <Link to="/reserve" className={linkClass("/reserve")}>Reservas</Link>
      </nav>
    </aside>
  );
}
