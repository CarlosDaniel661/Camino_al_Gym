import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        console.error("Error al cargar post:", err);
        setError("No se pudo cargar este contenido.");
      });
  }, [id]);

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <Link className="text-blue-600 underline mt-4 inline-block" to="/">← Volver al inicio</Link>
      </div>
    );
  }

  if (!post) return <div className="p-6 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black transition" onClick={() => navigate(-1)}>← Volver</button>

      <article className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        <div className="bg-black flex justify-center">
          {post.media_type === "image" && post.media_url && (
            <img src={post.media_url} alt={post.title} className="max-h-[600px] w-full object-contain bg-black" />
          )}

          {post.media_type === "video" && post.media_url && (
            <video controls src={post.media_url} className="max-h-[600px] w-full object-contain" />
          )}

          {post.media_type === "embed" && post.media_url && (
            <div className="relative w-full pt-[56.25%]">
              <iframe src={post.media_url} title={post.title} className="absolute top-0 left-0 w-full h-full" allowFullScreen />
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">{post.body}</p>

          <div className="flex items-center gap-5 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
              onClick={() => axios.post(`/api/like/${post.id}`).then((r) => setPost({ ...post, likes: r.data.likes })).catch(()=>{})}>
              ❤️ <span>{post.likes || 0}</span>
            </button>

            <Link className="text-blue-600 dark:text-blue-400 font-medium hover:underline" to="/">Volver al inicio</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
