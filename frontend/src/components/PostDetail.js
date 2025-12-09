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

    // increment visits for analytics
    axios.post('/api/visit').catch(()=>{});
  }, [id]);

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#dc2626' }}>
          Error
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        <Link className="hover:underline mt-4 inline-block" to="/">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>
        Cargando...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button 
        className="mb-4 flex items-center gap-2 transition"
        style={{ color: 'var(--text-secondary)' }}
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <article 
        className="shadow-lg rounded-xl overflow-hidden border"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--card-border)'
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h1 className="text-2xl font-bold feed-title">{post.title}</h1>
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
              <iframe src={post.media_url} title={post.title} className="absolute top-0 left-0 w-full h-full" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {post.body}
          </p>
          <div className="flex items-center gap-5 mt-6 flex-wrap">
            <button 
              className="flex items-center gap-2 px-4 py-2 text-white rounded-full shadow transition hover:opacity-90"
              style={{ backgroundColor: '#ef4444' }}
              onClick={() => axios.post(`/api/like/${post.id}`).then((r) => setPost({ ...post, likes: r.data.likes })).catch(()=>{})}
            >
              ❤️ <span>{post.likes || 0}</span>
            </button>

            <Link className="font-medium hover:underline" to="/">
              Volver al inicio
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
