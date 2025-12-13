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
      await axios.post("/api/reserve", form);
      setStatus("ok");
      setForm({ name: "", contact: "", service: "", date: "", notes: "" });
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div 
      className="max-w-xl mx-auto shadow-md rounded-xl p-6 mt-6"
      style={{ backgroundColor: 'var(--card)' }}
    >
      <h2 className="text-2xl font-bold mb-4 feed-title">Reservar turno</h2>

      <div className="space-y-4">
        <input 
          className="w-full border rounded-lg p-3"
          style={{ 
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)'
          }}
          placeholder="Nombre" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        <input 
          className="w-full border rounded-lg p-3"
          style={{ 
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)'
          }}
          placeholder="Teléfono o email" 
          value={form.contact} 
          onChange={(e) => setForm({ ...form, contact: e.target.value })} 
        />
        <select 
          className="w-full border rounded-lg p-3"
          style={{ 
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)'
          }}
          value={form.service} 
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          <option value="">Seleccioná un servicio</option>
          <option value="clase-personal">Entrenamiento y Rutina</option>
          <option value="clase-grupal">Entrenamiento Personalizado</option>
          <option value="evaluacion">Clase Funcional</option>
        </select>
        <input 
          type="datetime-local" 
          className="w-full border rounded-lg p-3"
          style={{ 
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)'
          }}
          value={form.date} 
          onChange={(e) => setForm({ ...form, date: e.target.value })} 
        />
        <textarea 
          className="w-full border rounded-lg p-3"
          style={{ 
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)'
          }}
          placeholder="Notas (opcional)" 
          rows="4" 
          value={form.notes} 
          onChange={(e) => setForm({ ...form, notes: e.target.value })} 
        />

        <button 
          onClick={submit} 
          className="w-full text-white py-3 rounded-lg text-lg font-medium transition hover:opacity-90"
          style={{ backgroundColor: '#2563eb' }}
        >
          Enviar reserva
        </button>

        {status === "ok" && (
          <div className="font-medium text-center mt-2" style={{ color: '#16a34a' }}>
            Reserva enviada. ¡Gracias!
          </div>
        )}
        {status === "error" && (
          <div className="font-medium text-center mt-2" style={{ color: '#dc2626' }}>
            Ocurrió un error. Intenta nuevamente.
          </div>
        )}
        {status === "missing" && (
          <div className="font-medium text-center mt-2" style={{ color: '#ea8900' }}>
            Completa nombre, servicio y fecha.
          </div>
        )}
      </div>
    </div>
  );
}
