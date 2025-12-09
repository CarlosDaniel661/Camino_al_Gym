import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const observerRef = useRef(null);

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line
  }, []);

  function loadPage(p) {
    setLoading(true);
    axios.get(`/api/posts/page/${p}`)
      .then((res) => {
        setPosts(res.data.items || []);
        setHasNext(Boolean(res.data.has_next));
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setHasNext(false);
        setLoading(false);
      });
  }

  function loadMore() {
    if (!hasNext || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    axios.get(`/api/posts/page/${nextPage}`).then((res) => {
      setPosts((prev) => [...prev, ...(res.data.items || [])]);
      setPage(nextPage);
      setHasNext(Boolean(res.data.has_next));
      setLoadingMore(false);
    }).catch(()=> setLoadingMore(false));
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [observerRef.current, hasNext]);

  if (loading) return <p className="p-6 text-center text-gray-500 dark:text-gray-300">Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold feed-title">Publicaciones</h1>
      </header>

      {posts.length === 0 ? (
        <div className="text-center" style={{ color: 'var(--text-muted)' }}>
          No hay publicaciones aún.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <article 
              key={p.id} 
              className="shadow-sm border rounded-xl overflow-hidden"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--card-border)'
              }}
            >
              {p.media_type === "image" && p.media_url && (
                <img src={p.media_url} alt={p.title} className="w-full max-h-[380px] object-cover" />
              )}

              {p.media_type === "video" && p.media_url && (
                <video src={p.media_url} controls className="w-full max-h-[380px] object-cover" />
              )}

              <div className="p-4">
                <h3 className="font-bold text-xl mb-1 feed-title">{p.title}</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {p.body?.slice(0, 180)}{p.body && p.body.length > 180 ? "..." : ""}
                </p>

                <div className="flex justify-between items-center">
                  <Link to={`/post/${p.id}`} className="font-medium hover:underline">
                    Ver más →
                  </Link>

                  <button 
                    className="flex items-center gap-1 transition"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => {
                      axios.post(`/api/like/${p.id}`).then((r) => {
                        setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, likes: r.data.likes } : x));
                      }).catch(()=>{});
                    }}
                  >
                    ❤️ <span>{p.likes || 0}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasNext && (
        <div ref={observerRef} className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
          {loadingMore ? "Cargando más..." : "Desliza para ver más"}
        </div>
      )}
    </div>
  );
}
