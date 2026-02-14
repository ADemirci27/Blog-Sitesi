"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  bio?: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  tag: string;
};

type ImagePost = {
  id: string;
  url: string;
  createdAt: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [images, setImages] = useState<ImagePost[]>([]);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
          setBio(data.user.bio || "");
          fetchUserContent();
        }
      })
      .catch(() => router.push("/login"));
  };

  const fetchUserContent = async () => {
    try {
      const res = await fetch("/api/posts/my");
      const data = await res.json();

      setPosts(data.posts || []);
      setImages(data.images || []);

      setLoading(false);
    } catch (error) {
      setPosts([]);
      setImages([]);
      setLoading(false);
    }
  };

  const saveBio = async () => {
    setSaving(true);

    const res = await fetch("/api/users/bio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio }),
    });

    if (res.ok) {
      setEditingBio(false);
      fetchUser();
    }

    setSaving(false);
  };

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 font-serif text-gray-900 dark:text-white">
      <h1
        className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Hesabım
      </h1>

      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Kullanıcı Bilgileri
        </h2>

        <div className="space-y-2 text-gray-800 dark:text-gray-200">
          <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p>
            <strong>Kayıt Tarihi:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>

      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Biyografi
        </h2>

        {!editingBio ? (
          <div>
            {bio ? (
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                {bio}
              </p>
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">
                Bu kullanıcıya ait biyografi yazısı bulunamamıştır
              </p>
            )}

            <button
              onClick={() => setEditingBio(true)}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
            >
              Biyografiyi Düzenle
            </button>
          </div>
        ) : (
          <div>
            <textarea
              className="w-full border p-3 rounded mb-3 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); 
                  if (!saving) {
                    saveBio();
                  }
                }
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={saveBio}
                disabled={saving}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>

              <button
                onClick={() => setEditingBio(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Benim Yazılarım
        </h2>

        {loading ? (
          <p className="text-gray-900 dark:text-white">Yükleniyor...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Henüz yazınız yok.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="p-3 border rounded-lg dark:border-gray-700">
                <Link href={`/posts/${post.slug}`}>
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white">
                      {post.title}
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      #{post.tag}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Paylaştığım Fotoğraflar
        </h2>

        {loading ? (
          <p className="text-gray-900 dark:text-white">Yükleniyor...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Henüz fotoğraf paylaşmadınız.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img) => (
              <Link key={img.id} href={`/images/${img.id}`}>
                <div className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600">
                  <img
                    src={img.url}
                    alt="Kullanıcı Fotoğrafı"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(img.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
