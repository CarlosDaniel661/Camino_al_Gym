import React, { useState } from "react";
import axios from "axios";

export default function Reserve() {
  const [form, setForm] = useState({ name: "", contact: "", service: "", date: "", notes: "" });
  const [status, setStatus] = useState(null);

  const submit = async () => {
    if (!form.name || !form.service || !form.date) {
      setStatus("missing");
      return;
    }
    try {
      // Puedes cambiar a POST real a /api/reserve si querés guardar en backend
      await axios.post("/api/reserve", form);
      setStatus("ok");
      setForm({ name: "", contact: "", service: "", date: "", notes: "" });
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Reservar turno</h2>

      <div className="space-y-4">
        <input className="w-full border border-gray-300 rounded-lg p-3" placeholder="Nombre" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input className="w-full border border-gray-300 rounded-lg p-3" placeholder="Teléfono o email" value={form.contact} onChange={(e)=>setForm({...form,contact:e.target.value})} />
        <select className="w-full border border-gray-300 rounded-lg p-3" value={form.service} onChange={(e)=>setForm({...form,service:e.target.value})}>
          <option value="">Seleccioná un servicio</option>
          <option value="clase-personal">Clase personal</option>
          <option value="clase-grupal">Clase grupal</option>
          <option value="evaluacion">Evaluación física</option>
        </select>
        <input type="datetime-local" className="w-full border border-gray-300 rounded-lg p-3" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} />
        <textarea className="w-full border border-gray-300 rounded-lg p-3" placeholder="Notas (opcional)" rows="4" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} />

        <button onClick={submit} className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">Enviar reserva</button>

        {status === "ok" && <div className="text-green-600 font-medium text-center mt-2">Reserva enviada. ¡Gracias!</div>}
        {status === "error" && <div className="text-red-600 font-medium text-center mt-2">Ocurrió un error. Intenta nuevamente.</div>}
        {status === "missing" && <div className="text-yellow-600 font-medium text-center mt-2">Completa nombre, servicio y fecha.</div>}
      </div>
    </div>
  );
}
