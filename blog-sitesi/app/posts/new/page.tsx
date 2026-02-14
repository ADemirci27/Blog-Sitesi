"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
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
      setMessage("Yazı başarıyla oluşturuldu!");
      setTimeout(() => router.push("/"), 1000);
    } else {
      const data = await res.json();
      setMessage(data.error || "Yazı oluşturulamadı.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 font-serif">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6">
        <h1
          className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Yeni Yazı Oluştur
        </h1>

        {message && (
          <p className="mb-3 text-center font-semibold text-green-600 dark:text-green-400">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block mb-1 font-semibold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Başlık
            </label>
            <input
              className="
                w-full border p-2.5 rounded-2xl
                bg-gray-50 dark:bg-gray-700
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition-all
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Yazınızın başlığını girin..."
            />
          </div>

          <div>
            <label
              className="block mb-1 font-semibold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Etiket (Tag)
            </label>
            <input
              className="
                w-full border p-2.5 rounded-2xl
                bg-gray-50 dark:bg-gray-700
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition-all
              "
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
              placeholder="Örn: teknoloji, spor, eğitim"
            />
          </div>

          <div>
            <label
              className="block mb-1 font-semibold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              İçerik
            </label>
            <textarea
              className="
                w-full border p-2.5 rounded-2xl
                h-40 resize-none
                bg-gray-50 dark:bg-gray-700
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition-all
              "
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Yazı içeriğinizi buraya yazın..."
            />
          </div>

          <button
            type="submit"
            className="
              w-full py-2.5 mt-1
              bg-purple-600 hover:bg-purple-700
              text-white font-semibold
              rounded-2xl transition-all
              duration-200
            "
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Yayınla
          </button>
        </form>
      </div>
    </main>
  );
}
