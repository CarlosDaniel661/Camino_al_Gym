import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async () => {
    setErr(null);
    try {
      await api.post("/api/admin/login", form);
      navigate("/admin/dashboard");
    } catch {
      setErr("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Panel Administrativo
        </h2>

        <input
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Ingresar
        </button>

        {err && <p className="text-red-600 text-center mt-3">{err}</p>}
      </div>
    </div>
  );
}
