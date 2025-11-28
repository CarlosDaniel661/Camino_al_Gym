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
        setPage(p);
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
    axios.get(`/api/posts/page/${nextPage}`)
      .then((res) => {
        setPosts((prev) => [...prev, ...(res.data.items || [])]);
        setPage(nextPage);
        setHasNext(Boolean(res.data.has_next));
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
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

  if (loading) return <p className="p-6 text-center text-gray-500">Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        {/* no extra nav here (redundancia eliminada) */}
      </header>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500">No hay publicaciones aún.</div>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <article key={p.id} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {p.media_type === "image" && p.media_url && (
                <img src={p.media_url} alt={p.title} className="w-full max-h-[380px] object-cover" />
              )}

              {p.media_type === "video" && p.media_url && (
                <video src={p.media_url} controls className="w-full max-h-[380px] object-cover" />
              )}

              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{p.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  {p.body?.slice(0, 180)}{p.body && p.body.length > 180 ? "..." : ""}
                </p>

                <div className="flex justify-between items-center">
                  <Link to={`/post/${p.id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Ver más →</Link>

                  <button className="flex items-center gap-1 text-gray-800 dark:text-gray-200 hover:text-blue-600"
                    onClick={() => {
                      axios.post(`/api/like/${p.id}`).then((r) => {
                        setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, likes: r.data.likes } : x));
                      }).catch(()=>{});
                    }}>
                    ❤️ <span>{p.likes || 0}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasNext && (
        <div ref={observerRef} className="py-6 text-center text-gray-400">
          {loadingMore ? "Cargando más..." : "Desliza para ver más"}
        </div>
      )}
    </div>
  );
}
