import React, { useEffect, useState } from "react";
import api from "../api";
import { FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from "react-icons/fa";

export default function About() {
  const [profileOwner, setProfileOwner] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/profile")
      .then((r) => {
        if (r.data && r.data.profile_owner_url) {
          setProfileOwner(r.data.profile_owner_url);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 feed-title">Sobre mí</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-6">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <img
            src={profileOwner || "/profile.jpg"}
            alt="Owner profile"
            className="max-w-xs md:max-w-sm rounded-lg shadow profile-img profile-focus-safe"
            style={{
              maxHeight: "500px",
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        <div className="flex-1">
          <p
            className="leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            ¡Bienvenido a mi Blog! Soy Josías. Soy el creador y entrenador detrás
            de Camino al Gym, soy un tipo común con ganas de vivir mas! Soy
            preparador físico, emprendedor, viajero y dueño de AzurGym. Comparto
            rutinas, consejos sobre como empezar tu camino a una vida mas
            saludable y contenidos de motivación para ayudarte a transformar tu
            cuerpo y mente sin importar tu nivel actual!
          </p>

          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Mi enfoque es práctico, progresivo y sostenible. Aquí encontrarás
            rutinas, contenido exclusivo, videos inspiradores, y la posibilidad
            de reservar clases o comunicarte directamente.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2 feed-title">
        Seguime en mis redes
      </h2>

      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <FaInstagram />
          <a
            href="https://instagram.com/azurgym2020"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
        </li>

        <li className="flex items-center gap-2">
          <FaWhatsapp />
          <a
            href="https://wa.me/543624777466"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            WhatsApp
          </a>
        </li>

        <li className="flex items-center gap-2">
          <FaYoutube />
          <a
            href="https://youtube.com/@josiasjurao9"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            YouTube
          </a>
        </li>

        <li className="flex items-center gap-2">
          <FaTiktok />
          <a
            href="https://www.tiktok.com/@contamanoo"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            TikTok
          </a>
        </li>
      </ul>
    </div>
  );
}
