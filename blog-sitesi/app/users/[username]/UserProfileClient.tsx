"use client";

import { useState, useEffect } from "react";

export default function UserProfileClient({ user }: { user: any }) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) {
          setCurrentUserId(data.user.id);
        }
      });
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: user.id,
        content: message,
      }),
    });

    if (res.ok) {
      setMessage("");
      setShowForm(false);
      alert("Mesaj gönderildi!");
    } else {
      alert("Mesaj gönderilemedi!");
    }
  };

  const isOwnProfile = currentUserId === user.id;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {user.username}
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          Biyografi
        </h2>

        {user.bio ? (
          <p className="whitespace-pre-line text-gray-900 dark:text-gray-100">
            {user.bio}
          </p>
        ) : (
          <p className="italic text-gray-700 dark:text-gray-300">
            Bu kullanıcıya ait biyografi yazısı bulunamamıştır
          </p>
        )}

        
        {!isOwnProfile && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Mesaj Gönder
          </button>
        )}

        {showForm && !isOwnProfile && (
          <div className="mt-4 border rounded p-4 bg-gray-100 dark:bg-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Mesaj Gönder
            </h2>

            <textarea
              className="w-full border p-2 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Mesajınızı yazın..."
            />

            <div className="flex gap-2">
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Gönder
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
