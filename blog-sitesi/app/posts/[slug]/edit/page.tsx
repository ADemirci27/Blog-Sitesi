"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setTag(data.tag);
      });
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${params.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        tag,
      }),
    });

    if (res.ok) {
      setMessage("Yazı başarıyla güncellendi!");
      setTimeout(() => router.push(`/posts/${params.slug}`), 1000);
    } else {
      setMessage("Güncelleme başarısız.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Yazıyı Düzenle</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Başlık</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Etiket</label>
          <input
            className="w-full border p-2 rounded"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">İçerik</label>
          <textarea
            className="w-full border p-2 rounded h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>
    </main>
  );
}
