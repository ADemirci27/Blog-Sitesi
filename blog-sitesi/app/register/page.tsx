"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      setMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsun...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage("Kayıt işlemi sırasında hata oluştu.");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6 font-sans">

      
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
        Kayıt Ol
      </h1>

      
      {message && (
        <p className="mb-4 text-center text-green-600 text-sm">
          {message}
        </p>
      )}

      
      <form onSubmit={handleSubmit} className="space-y-3">

        
        <div>
          <label className="block mb-1 text-gray-900 dark:text-gray-100 text-sm">
            Kullanıcı Adı
          </label>
          <input
            className="w-full border p-2.5 rounded-full text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        
        <div>
          <label className="block mb-1 text-gray-900 dark:text-gray-100 text-sm">
            Email
          </label>
          <input
            type="email"
            className="w-full border p-2.5 rounded-full text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Email adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        
        <div>
          <label className="block mb-1 text-gray-900 dark:text-gray-100 text-sm">
            Şifre
          </label>
          <input
            type="password"
            className="w-full border p-2.5 rounded-full text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg text-sm"
        >
          Kayıt Ol
        </button>
      </form>

      
      <p className="mt-4 text-center text-gray-900 dark:text-gray-100 text-sm">
        Zaten hesabın var mı?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Giriş Yap
        </Link>
      </p>

    </main>
  );
}
