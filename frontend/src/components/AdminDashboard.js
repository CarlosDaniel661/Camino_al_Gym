import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [services, setServices] = useState([]);
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
      if (profRes.data?.visits) setVisits(profRes.data.visits);
    } catch {
      navigate("/admin");
    }
  };

  const logout = async () => {
    await api.post("/api/admin/logout");
    navigate("/");
  };

  const deletePost = async (id) => {
    if (!window.confirm("Eliminar publicación?")) return;
    await api.delete(`/api/admin/posts/${id}`);
    setPosts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </div>

      <h2 className="font-semibold mb-2">Publicaciones</h2>
      {posts.map((p) => (
        <div key={p.id} className="border p-3 rounded mb-2 flex justify-between">
          <div>
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-gray-500">
              {new Date(p.created_at).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => deletePost(p.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>
        </div>
      ))}

      <div className="mt-6">
        <h2 className="font-semibold">Visitas</h2>
        <div className="text-xl">{visits}</div>
      </div>
    </div>
  );
}
