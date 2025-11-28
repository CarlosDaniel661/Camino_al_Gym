import React, { useState } from "react";
import axios from "axios";

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
      <div className="p-6 mt-10 max-w-md mx-auto text-center bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-green-600">¡Mensaje enviado!</h1>
        <p className="text-gray-700 dark:text-gray-200">Gracias por comunicarte, responderé lo antes posible.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex justify-center">
      <form className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center mb-4">Contacto</h1>

        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring focus:ring-blue-300 outline-none" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring focus:ring-blue-300 outline-none" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Mensaje</label>
          <textarea className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring focus:ring-blue-300 outline-none" rows="5" name="message" value={form.message} onChange={handleChange} required />
        </div>

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">Enviar mensaje</button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
          También podés escribir por:
          <div className="flex justify-center gap-3 mt-2">
            <a href="mailto:azurgym@gmail.com" className="underline">Email</a>
            <a href="https://wa.me/543624777466" target="_blank" rel="noreferrer" className="underline">WhatsApp</a>
            <a href="https://instagram.com/azurgym2020" target="_blank" rel="noreferrer" className="underline">Instagram</a>
          </div>
        </div>
      </form>
    </div>
  );
}
