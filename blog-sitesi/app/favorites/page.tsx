"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      });
  }, []);

  const removeFavorite = async (fav: any) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        favoriteId: fav.id,
      }),
    });

    setFavorites((prev) =>
      prev.filter((f) => f.id !== fav.id)
    );
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-900 dark:text-gray-100">
        Yükleniyor...
      </p>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        ⭐ Favorilerim
      </h1>

      {favorites.length === 0 && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Henüz favoriye eklediğin içerik yok.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md"
          >
            {fav.post && (
              <Link href={`/posts/${fav.post.slug}`}>
                <h2 className="text-xl font-semibold hover:underline text-gray-900 dark:text-white">
                  {fav.post.title}
                </h2>
              </Link>
            )}

            {fav.image && (
              <Link href={`/images/${fav.image.id}`}>
                <h2 className="text-xl font-semibold hover:underline text-gray-900 dark:text-white">
                  {fav.image.name}
                </h2>
              </Link>
            )}

            {!fav.post && !fav.image && (
              <p className="text-gray-500 italic">
                (Silinmiş içerik)
              </p>
            )}

            <button
              onClick={() => removeFavorite(fav)}
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Favorilerden Çıkar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
