import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", media_type: "none", embed_url: "", pinned: false });
  const [file, setFile] = useState(null);
  const [profileFiles, setProfileFiles] = useState({ profile_main: null, profile_owner: null });
  const [services, setServices] = useState([]);
  const [svcForm, setSvcForm] = useState({ title: "", description: "", price: "", id: null });
  const [visits, setVisits] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [pRes, sRes, profRes] = await Promise.all([
        axios.get("/api/posts"),
        axios.get("/api/services"),
        axios.get("/api/admin/profile")
      ]);
      setPosts(pRes.data || []);
      setServices(sRes.data || []);
      if (profRes.data && profRes.data.visits) setVisits(profRes.data.visits);
    } catch (e) {
      navigate("/admin");
    }
  };

  const logout = async () => {
    await axios.post("/api/admin/logout", {}, { withCredentials: true });
    navigate("/");
  };

  const submitPost = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("body", form.body);
    fd.append("media_type", form.media_type);
    if (form.media_type === "embed") fd.append("embed_url", form.embed_url);
    if (file) fd.append("media", file);
    if (form.pinned) fd.append("pinned", "1");
    await axios.post("/api/admin/posts", fd, { withCredentials: true });
    await fetchAll();
    setForm({ title: "", body: "", media_type: "none", embed_url: "", pinned: false });
    setFile(null);
  };

  const deletePost = async (id) => {
    if (!window.confirm("Eliminar publicación?")) return;
    await axios.delete(`/api/admin/posts/${id}`, { withCredentials: true });
    setPosts(posts.filter(p => p.id !== id));
  };

  // Profile images
  const submitProfile = async () => {
    const fd = new FormData();
    if (profileFiles.profile_main) fd.append('profile_main', profileFiles.profile_main);
    if (profileFiles.profile_owner) fd.append('profile_owner', profileFiles.profile_owner);
    await axios.post('/api/admin/profile', fd, { withCredentials: true });
    setProfileFiles({ profile_main: null, profile_owner: null });
    await fetchAll();
    alert("Perfil actualizado");
  };

  // Services CRUD
  const createOrUpdateService = async () => {
    if (!svcForm.title) return alert("Título requerido");
    if (svcForm.id) {
      await axios.put(`/api/admin/services/${svcForm.id}`, svcForm, { withCredentials: true });
    } else {
      await axios.post(`/api/admin/services`, svcForm, { withCredentials: true });
    }
    setSvcForm({ title: "", description: "", price: "", id: null });
    await fetchAll();
  };

  const editService = (s) => setSvcForm({ title: s.title, description: s.description, price: s.price, id: s.id });

  const deleteService = async (id) => {
    if (!window.confirm("Eliminar servicio?")) return;
    await axios.delete(`/api/admin/services/${id}`, { withCredentials: true });
    await fetchAll();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold dark:text-gray-100">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="px-3 py-1 bg-gray-200 rounded dark:bg-gray-700">Recargar</button>
          <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Cerrar sesión</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Posts */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow dark:bg-card">
          <h3 className="font-semibold mb-3 dark:text-gray-100">Nueva publicación</h3>
          <input placeholder="Título" className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Contenido" className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
          <select className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={form.media_type} onChange={e => setForm({ ...form, media_type: e.target.value })}>
            <option value="none">Ninguno</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="embed">Embed (YouTube)</option>
          </select>
          {form.media_type === "embed" && (
            <input placeholder="Embed URL" className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={form.embed_url} onChange={e => setForm({ ...form, embed_url: e.target.value })} />
          )}
          <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />
          <label className="flex items-center gap-2 mb-3 dark:text-gray-200">
            <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} />
            <span>Destacado</span>
          </label>
          <button onClick={submitPost} className="bg-blue-600 text-white px-4 py-2 rounded">Publicar</button>

          <h3 className="font-semibold mt-6 mb-3 dark:text-gray-100">Publicaciones</h3>
          <div className="space-y-3">
            {posts.length === 0 && <div className="text-gray-500 dark:text-gray-300">No hay publicaciones</div>}
            {posts.map(p => (
              <div key={p.id} className="flex justify-between items-center border p-3 rounded dark:border-gray-700">
                <div>
                  <div className="font-medium dark:text-gray-100">{p.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deletePost(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: profile images, services, visits */}
        <div className="bg-white p-4 rounded shadow flex flex-col gap-4 dark:bg-card">
          <div>
            <h3 className="font-semibold mb-2 dark:text-gray-100">Imagenes de perfil</h3>
            <input type="file" onChange={e => setProfileFiles({ ...profileFiles, profile_main: e.target.files[0] })} className="mb-2" />
            <input type="file" onChange={e => setProfileFiles({ ...profileFiles, profile_owner: e.target.files[0] })} className="mb-2" />
            <button onClick={submitProfile} className="bg-green-600 text-white px-3 py-1 rounded">Actualizar imágenes</button>
          </div>

          <div>
            <h3 className="font-semibold mb-2 dark:text-gray-100">Servicios</h3>
            <input placeholder="Título" className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={svcForm.title} onChange={e => setSvcForm({ ...svcForm, title: e.target.value })} />
            <input placeholder="Precio" className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={svcForm.price} onChange={e => setSvcForm({ ...svcForm, price: e.target.value })} />
            <textarea placeholder="Descripción" className="w-full border p-2 rounded mb-2 dark:bg-transparent dark:border-gray-600 dark:text-gray-200" value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={createOrUpdateService} className="bg-blue-600 text-white px-3 py-1 rounded">{svcForm.id ? "Actualizar" : "Crear"}</button>
              <button onClick={() => setSvcForm({ title: "", description: "", price: "", id: null })} className="px-3 py-1 bg-gray-200 rounded">Limpiar</button>
            </div>

            <div className="mt-3 space-y-2">
              {services.map(s => (
                <div key={s.id} className="flex justify-between items-center border p-2 rounded dark:border-gray-700">
                  <div>
                    <div className="font-medium dark:text-gray-100">{s.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{s.price}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editService(s)} className="px-2 py-1 bg-yellow-400 rounded">Editar</button>
                    <button onClick={() => deleteService(s.id)} className="px-2 py-1 bg-red-500 text-white rounded">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 dark:text-gray-100">Visitas</h3>
            <div className="text-xl dark:text-gray-100">{visits}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
