import React, { useEffect, useState } from "react";
import api from "../api";
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
        api.get("/api/posts"),
        api.get("/api/services"),
        api.get("/api/admin/profile"),
      ]);
      setPosts(pRes.data || []);
      setServices(sRes.data || []);
      if (profRes.data && profRes.data.visits) setVisits(profRes.data.visits);
    } catch (e) {
      console.error("Error fetching data:", e);
      navigate("/admin");
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/admin/logout");
      navigate("/");
    } catch (e) {
      console.error("Logout error:", e);
      navigate("/");
    }
  };

  const submitPost = async () => {
    if (!form.title || !form.body) {
      alert("Título y contenido son requeridos");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("body", form.body);
      fd.append("media_type", form.media_type);
      if (form.media_type === "embed") fd.append("embed_url", form.embed_url);
      if (file) fd.append("media", file);
      if (form.pinned) fd.append("pinned", "1");
      
      await api.post("/api/admin/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      await fetchAll();
      setForm({ title: "", body: "", media_type: "none", embed_url: "", pinned: false });
      setFile(null);
      alert("Publicación creada");
    } catch (e) {
      console.error("Error creating post:", e);
      alert("Error al crear publicación");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    try {
      await api.delete(`/api/admin/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Error deleting post:", e);
      alert("Error al eliminar publicación");
    }
  };

  const submitProfile = async () => {
    if (!profileFiles.profile_main && !profileFiles.profile_owner) {
      alert("Selecciona al menos una imagen");
      return;
    }
    try {
      const fd = new FormData();
      if (profileFiles.profile_main) fd.append("profile_main", profileFiles.profile_main);
      if (profileFiles.profile_owner) fd.append("profile_owner", profileFiles.profile_owner);
      
      await api.post("/api/admin/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setProfileFiles({ profile_main: null, profile_owner: null });
      await fetchAll();
      alert("Perfil actualizado");
    } catch (e) {
      console.error("Error updating profile:", e);
      alert("Error al actualizar perfil");
    }
  };

  const createOrUpdateService = async () => {
    if (!svcForm.title) {
      alert("Título requerido");
      return;
    }
    try {
      if (svcForm.id) {
        await api.put(`/api/admin/services/${svcForm.id}`, svcForm);
      } else {
        await api.post("/api/admin/services", svcForm);
      }
      setSvcForm({ title: "", description: "", price: "", id: null });
      await fetchAll();
      alert(svcForm.id ? "Servicio actualizado" : "Servicio creado");
    } catch (e) {
      console.error("Error with service:", e);
      alert("Error al procesar servicio");
    }
  };

  const editService = (s) => {
    setSvcForm({ title: s.title, description: s.description, price: s.price, id: s.id });
  };

  const deleteService = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    try {
      await api.delete(`/api/admin/services/${id}`);
      await fetchAll();
    } catch (e) {
      console.error("Error deleting service:", e);
      alert("Error al eliminar servicio");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchAll}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Recargar
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Posts Section - Main Content */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Nueva Publicación</h2>

          <div className="space-y-4 mb-6 border-b pb-6">
            <input
              type="text"
              placeholder="Título"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Contenido"
              rows="5"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />

            <select
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.media_type}
              onChange={(e) => setForm({ ...form, media_type: e.target.value })}
            >
              <option value="none">Sin media</option>
              <option value="image">Imagen</option>
              <option value="video">Video</option>
              <option value="embed">Embed (YouTube)</option>
            </select>

            {form.media_type === "embed" && (
              <input
                type="text"
                placeholder="URL del embed (ej: https://www.youtube.com/embed/...)"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.embed_url}
                onChange={(e) => setForm({ ...form, embed_url: e.target.value })}
              />
            )}

            {form.media_type !== "none" && form.media_type !== "embed" && (
              <input
                type="file"
                accept={form.media_type === "image" ? "image/*" : "video/*"}
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border p-3 rounded-lg"
              />
            )}

            <label className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              />
              <span className="font-medium">Marcar como destacado</span>
            </label>

            <button
              onClick={submitPost}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Publicar
            </button>
          </div>

          <h3 className="text-xl font-bold mb-4">Publicaciones</h3>
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-500">No hay publicaciones aún</p>
            ) : (
              posts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-start border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{p.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {p.body}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePost(p.id)}
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex-shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Profile & Services */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Imágenes de Perfil</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Foto principal (Sidebar)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileFiles({ ...profileFiles, profile_main: e.target.files[0] })
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Foto del Owner (About page)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileFiles({ ...profileFiles, profile_owner: e.target.files[0] })
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <button
                onClick={submitProfile}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Actualizar Imágenes
              </button>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Servicios</h3>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Título del servicio"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={svcForm.title}
                onChange={(e) => setSvcForm({ ...svcForm, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Precio"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={svcForm.price}
                onChange={(e) => setSvcForm({ ...svcForm, price: e.target.value })}
              />
              <textarea
                placeholder="Descripción"
                rows="3"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={svcForm.description}
                onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  onClick={createOrUpdateService}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {svcForm.id ? "Actualizar" : "Crear"}
                </button>
                <button
                  onClick={() =>
                    setSvcForm({ title: "", description: "", price: "", id: null })
                  }
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {services.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay servicios</p>
              ) : (
                services.map((s) => (
                  <div
                    key={s.id}
                    className="border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-600">{s.price}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.description}</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => editService(s)}
                        className="flex-1 px-2 py-1 bg-yellow-400 text-gray-800 rounded text-sm hover:bg-yellow-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Visits Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">Visitas</h3>
            <div className="text-3xl font-bold text-blue-600">{visits}</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
