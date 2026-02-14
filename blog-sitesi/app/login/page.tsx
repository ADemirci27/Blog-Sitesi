"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh(); 
    } catch (err) {
      setError("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 font-sans text-gray-900 dark:text-gray-100">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-gray-900 dark:text-gray-100">

        
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
          Giriş Yap
        </h1>

        
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2.5 rounded-full text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 transition focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2.5 rounded-full text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 transition focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full text-white font-semibold text-sm shadow-md transition-all ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        
        {error && (
          <p className="text-red-600 mt-3 text-center text-sm">
            {error}
          </p>
        )}

        
        <p className="mt-4 text-center text-gray-900 dark:text-gray-100 text-sm">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Kayıt Ol
          </Link>
        </p>

      </div>
    </main>
  );
}
