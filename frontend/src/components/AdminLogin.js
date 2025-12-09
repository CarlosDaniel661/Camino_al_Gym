import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async () => {
    setErr(null);
    try {
      await axios.post("/api/admin/login", form, { withCredentials: true });
      navigate("/admin/dashboard");
    } catch (e) {
      setErr("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 dark:bg-transparent">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6 dark:bg-card">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-100">Panel Administrativo</h2>

        <div className="space-y-4">
          <input placeholder="Usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-300 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" />
          <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-300 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" />
          <button onClick={submit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Ingresar</button>
          {err && <p className="text-red-600 text-center text-sm">{err}</p>}
        </div>
      </div>
    </div>
  );
}
