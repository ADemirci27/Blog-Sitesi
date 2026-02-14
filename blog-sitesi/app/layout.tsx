"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname(); 

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, [pathname]); 

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen font-sans">
        
        
        <div
          className={`
            fixed top-0 left-0 h-full w-64 
            bg-white dark:bg-gray-800 shadow-lg
            transform transition-transform duration-300 z-50
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <span className="font-bold text-lg">Menü</span>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-xl"
            >
              ✖
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-4">
            <Link
              href="/"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              🏠 Ana Sayfa
            </Link>

            {user && (
              <>
                <Link
                  href="/favorites"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                  onClick={() => setSidebarOpen(false)}
                >
                  ⭐ Favorilerim
                </Link>

                <Link
                  href="/posts/new"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                  onClick={() => setSidebarOpen(false)}
                >
                  ✍️ Yazı Oluştur
                </Link>

                <Link
                  href="/account"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                  onClick={() => setSidebarOpen(false)}
                >
                  👤 Hesabım
                </Link>

                <Link
                  href="/messages"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                  onClick={() => setSidebarOpen(false)}
                >
                  📩 DM
                </Link>

                <Link
                  href="/upload"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                  onClick={() => setSidebarOpen(false)}
                >
                  🖼️ Görsel İçerik Oluştur
                </Link>
              </>
            )}
          </nav>
        </div>

        
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-2xl"
              >
                ☰
              </button>

              <Link
                href="/"
                className="font-bold text-xl"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                📝 Blog Sitesi
              </Link>
            </div>

            <nav className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">🌞</span>

                <button
                  onClick={toggleTheme}
                  className={`
                    w-12 h-6 flex items-center rounded-full p-1 cursor-pointer
                    transition-colors duration-300
                    ${dark ? "bg-blue-600" : "bg-gray-300"}
                  `}
                >
                  <div
                    className={`
                      bg-white w-4 h-4 rounded-full shadow-md transform
                      transition-transform duration-300
                      ${dark ? "translate-x-6" : "translate-x-0"}
                    `}
                  />
                </button>

                <span className="text-sm">🌙</span>
              </div>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-sm hover:underline"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Çıkış Yap
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm hover:underline"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm hover:underline"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 blog-content">
          {children}
        </main>
      </body>
    </html>
  );
}
