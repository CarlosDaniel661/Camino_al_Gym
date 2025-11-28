import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", media_type: "none", embed_url: "", pinned: false });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    } catch (e) {
      navigate("/admin");
    }
  };

  const logout = async () => {
    await axios.post("/api/admin/logout", {}, { withCredentials: true });
    navigate("/");
  };

  const submit = async () => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("body", form.body);
      fd.append("media_type", form.media_type);
      if (form.media_type === "embed") fd.append("embed_url", form.embed_url);
      if (file) fd.append("media", file);
      if (form.pinned) fd.append("pinned", "1");

      await axios.post("/api/admin/posts", fd, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
      await fetchPosts();
      setForm({ title: "", body: "", media_type: "none", embed_url: "", pinned: false });
      setFile(null);
    } catch (e) {
      alert("Error al publicar. Asegurate de estar logueado.");
      navigate("/admin");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Eliminar publicación?")) return;
    await axios.delete(`/api/admin/posts/${id}`, { withCredentials: true });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={fetchPosts} className="px-3 py-1 bg-gray-200 rounded">Recargar</button>
          <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Cerrar sesión</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Nueva publicación</h3>
          <input placeholder="Título" className="w-full border p-2 rounded mb-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Contenido" className="w-full border p-2 rounded mb-2" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
          <select className="w-full border p-2 rounded mb-2" value={form.media_type} onChange={e => setForm({ ...form, media_type: e.target.value })}>
            <option value="none">Ninguno</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="embed">Embed (YouTube)</option>
          </select>
          {form.media_type === "embed" && <input placeholder="Embed URL (https://www.youtube.com/embed/ID)" className="w-full border p-2 rounded mb-2" value={form.embed_url} onChange={e => setForm({ ...form, embed_url: e.target.value })} />}
          <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />
          <label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} /> Destacado</label>
          <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Publicar</button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Publicaciones</h3>
          <div className="space-y-3">
            {posts.length === 0 && <div className="text-gray-500">No hay publicaciones</div>}
            {posts.map(p => (
              <div key={p.id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deletePost(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
