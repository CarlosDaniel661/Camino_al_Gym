import React from "react";

export default function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-6 items-center mb-6">
        <img src="/owner.jpg" alt="Dueño" className="w-28 h-28 rounded-full object-cover shadow-lg" />
        <div>
          <h1 className="text-3xl font-bold">Sobre mí</h1>
          <p className="text-sm text-gray-500">Entrenador · Preparador Físico · Creador de contenido · Mentor</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
        ¡Bienvenido! Soy Josías. Soy el creador y entrenador detrás de Camino al Gym, soy un tipo común con ganas de vivir mas! Soy preparador físico, emprendedor, viajero y dueño de AzurGym. 
        Comparto rutinas, consejos sobre como empezar tu camino a una vida mas saludable y contenidos de motivación para ayudarte a transformar tu cuerpo y mente sin importar tu nivel actual!
      </p>

      <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
        Mi enfoque es práctico, progresivo y sostenible. Aquí encontrarás rutinas, contenido exclusivo, videos inspiradores, y la posibilidad de reservar clases o comunicarte directamente.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Seguime</h2>
      <ul className="text-blue-600 underline">
        <li><a href="https://instagram.com/azurgym2020" target="_blank" rel="noreferrer">Instagram</a></li>
        <li><a href="https://wa.me/543624777466" target="_blank" rel="noreferrer">WhatsApp</a></li>
        <li><a href="https://youtube.com/@josiasjurao9" target="_blank" rel="noreferrer">YouTube</a></li>
        <li><a href="https://www.tiktok.com/@contamanoo" target="_blank" rel="noreferrer">TikTok</a></li>
      </ul>
    </div>
  );
}
