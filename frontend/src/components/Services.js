import React from "react";
import { Helmet } from "react-helmet-async";

const services = [
  {
    id: 1,
    title: "Programa de Transformación Física",
    description: "Entrenamiento completo adaptado a tu nivel. Rutinas semanales, guía de alimentación y seguimiento personalizado.",
    price: "25.000 ARS",
  },
  {
    id: 2,
    title: "Personalizado 1:1",
    description: "Sesiones privadas para mejorar disciplina, mentalidad y adherencia al plan.",
    price: "35.000 ARS",
  },
  {
    id: 3,
    title: "Plan Nutricional Personalizado",
    description: "Plan de alimentación hecho a medida + seguimiento mensual.",
    price: "25.000 ARS",
  },
];

export default function Services() {
  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Servicios | Camino al Gym</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Servicios Disponibles</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div key={svc.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2">{svc.title}</h2>
            <p className="text-gray-700 dark:text-gray-200 mb-3">{svc.description}</p>
            <p className="text-blue-600 font-semibold mb-4">Precio: {svc.price}</p>

            <form className="flex flex-col gap-3" onSubmit={(e)=>{e.preventDefault(); alert('Solicitud recibida — te contactaremos');}}>
              <input type="text" placeholder="Tu nombre" className="border p-2 rounded-lg" aria-label="Nombre" required />
              <input type="email" placeholder="Tu email" className="border p-2 rounded-lg" aria-label="Email" required />
              <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Inscribirme</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
