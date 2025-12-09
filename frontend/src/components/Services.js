import React, { useEffect, useState } from "react";
import axios from "axios";
// Helmet removed: page title is set in public/index.html to keep a single site title

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('/api/services').then(r => setServices(r.data)).catch(()=>{});
  }, []);

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 feed-title">Servicios Disponibles</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div 
            key={svc.id} 
            className="shadow-lg rounded-2xl p-6 border"
            style={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--card-border)'
            }}
          >
            <h2 className="text-xl font-bold mb-2 feed-title">{svc.title}</h2>
            <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
              {svc.description}
            </p>
            <p className="font-semibold mb-4">Precio: {svc.price}</p>

            <form className="flex flex-col gap-3" onSubmit={(e) => {
              e.preventDefault();
              alert("Gracias — te contactaremos para confirmar la inscripción.");
            }}>
              <input 
                type="text" 
                placeholder="Tu nombre" 
                className="border p-2 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)'
                }}
                aria-label="Nombre" 
                required 
              />
              <input 
                type="email" 
                placeholder="Tu email" 
                className="border p-2 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)'
                }}
                aria-label="Email" 
                required 
              />
              <button 
                type="submit" 
                className="text-white py-2 rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: '#2563eb' }}
              >
                Inscribirme
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
