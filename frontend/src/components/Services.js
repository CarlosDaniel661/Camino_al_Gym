import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/services")
      .then((r) => {
        setServices(r.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading services:", err);
        setError("Error al cargar los servicios");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-300">
          Cargando servicios...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 feed-title text-gray-900 dark:text-white">Servicios</h1>
          <p style={{ color: "var(--text-muted)" }}>{error}</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 feed-title text-gray-900 dark:text-white">Servicios Disponibles</h1>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏋️‍♂️</div>
            <h2 className="text-2xl font-bold mb-2 feed-title">
              No hay servicios disponibles aún
            </h2>
            <p style={{ color: "var(--text-secondary)" }} className="mb-6">
              Estamos trabajando en agregar nuevos servicios. ¡Vuelve pronto!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Contactanos
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="shadow-lg rounded-2xl p-6 border"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2 className="text-xl font-bold mb-2 feed-title">{svc.title}</h2>
              <p className="mb-3" style={{ color: "var(--text-secondary)" }}>
                {svc.description}
              </p>
              <p className="font-semibold mb-4">Precio: {svc.price}</p>

              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Gracias — te contactaremos para confirmar la inscripción.");
                }}
              >
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="border p-2 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                  aria-label="Nombre"
                  required
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  className="border p-2 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                  aria-label="Email"
                  required
                />
                <button
                  type="submit"
                  className="text-white py-2 rounded-lg transition hover:opacity-90"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  Inscribirme
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
