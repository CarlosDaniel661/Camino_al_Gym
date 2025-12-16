import React, { useState } from "react";
import axios from "axios";
import { FaWhatsapp, FaInstagram, FaYoutube, FaEnvelope, FaTiktok } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/contact", form)
      .then(() => setSent(true))
      .catch(() => alert("Ocurrió un error al enviar tu mensaje"));
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div
          className="p-6 mt-10 max-w-md mx-auto text-center shadow-md rounded-xl bg-white dark:bg-gray-800"
        >
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            ¡Mensaje enviado!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gracias por comunicarte, responderé lo antes posible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <form
        className="w-full max-w-md shadow-lg rounded-xl p-6 space-y-4 mx-auto mt-10 bg-white dark:bg-gray-800"
        onSubmit={handleSubmit}
      >
        className="w-full max-w-md shadow-lg rounded-xl p-6 space-y-4"
        style={{ backgroundColor: 'var(--card)' }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-4 feed-title">Contacto</h1>
        <div>
          <label className="block mb-1 font-medium" style={{ color: 'var(--text-primary)' }}>
            Nombre
          </label>
          <input 
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            style={{ 
              backgroundColor: 'var(--bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            }}
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" style={{ color: 'var(--text-primary)' }}>
            Email
          </label>
          <input 
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            style={{ 
              backgroundColor: 'var(--bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            }}
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" style={{ color: 'var(--text-primary)' }}>
            Mensaje
          </label>
          <textarea 
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            style={{ 
              backgroundColor: 'var(--bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            }}
            rows="5" 
            name="message" 
            value={form.message} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button 
          className="w-full text-white p-3 rounded-lg font-semibold transition hover:opacity-90"
          style={{ backgroundColor: '#2563eb' }}
        >
          Enviar mensaje
        </button>

        <div className="text-center text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          También podés escribir por:
          <div className="flex justify-center gap-3 mt-2 flex-wrap">
            <a href="mailto:azurgym@gmail.com" className="hover:underline flex items-center gap-2">
              <FaEnvelope /> Email
            </a>
            <a href="https://wa.me/543624777466" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="https://instagram.com/azurgym2020" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
              <FaInstagram /> Instagram
            </a>
            <a href="https://youtube.com/@josiasjurao9" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
              <FaYoutube /> YouTube
            </a>
            <a href="https://www.tiktok.com/@contamanoo" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
              <FaTiktok /> TikTok
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
