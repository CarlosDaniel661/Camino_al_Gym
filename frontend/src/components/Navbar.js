import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ theme, setTheme }) {
  // Keep theme local if not passed; preserve behavior if used as before
  const [localTheme, setLocalTheme] = useState(theme || (() => {
    try { return localStorage.getItem("theme") || "light"; } catch { return "light"; }
  }));

  useEffect(() => {
    const active = theme ?? localTheme;
    document.documentElement.setAttribute("data-theme", active === "dark" ? "dark" : "light");
    try { localStorage.setItem("theme", active); } catch {}
    // if parent provided setter, keep it in sync
    if (setTheme && typeof setTheme === "function") setTheme(active);
    // eslint-disable-next-line
  }, [localTheme, theme]);

  const toggle = () => {
    if (setTheme && typeof setTheme === "function") {
      setTheme(prev => prev === "dark" ? "light" : "dark");
    } else {
      setLocalTheme(prev => prev === "dark" ? "light" : "dark");
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 shadow-md z-50 flex items-center justify-between px-6"
      style={{ backgroundColor: 'var(--navbar-bg)', borderBottom: '1px solid var(--card-border)' }}
      role="banner"
    >
      <h1 
        className="text-2xl font-bold"
        style={{ color: 'var(--navbar-text)' }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Camino al Gym
        </Link>
      </h1>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="p-2 rounded-full transition"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--navbar-text)'
          }}
          title="Alternar modo oscuro"
        >
          <span aria-hidden>{(theme || localTheme) === "dark" ? "🌞" : "🌙"}</span>
        </button>

        {/* Admin profile image (links to admin) */}
        <Link to="/admin" aria-label="Ir al panel admin" title="Admin">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 object-cover cursor-pointer"
            style={{ borderColor: 'var(--card-border)' }}
          />
        </Link>
      </div>
    </header>
  );
}
