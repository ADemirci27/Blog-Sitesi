"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [conversation, setConversation] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    loadConversation();
  }, [userId]);

  const loadConversation = async () => {
    const res = await fetch(`/api/messages/conversation/${userId}`);
    const data = await res.json();
    setConversation(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId: userId,
        content: newMessage,
      }),
    });

    setNewMessage("");
    loadConversation();
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Konuşma
      </h1>

      <div className="border rounded p-4">
        <div className="h-96 overflow-auto border p-2 mb-2">
          {conversation.map((c, i) => (
            <div key={i} className="mb-2">
              <b>{c.senderId === userId ? "Karşı Taraf" : "Sen"}:</b>{" "}
              {c.content}
            </div>
          ))}
        </div>

        <textarea
          className="w-full border p-2 rounded mb-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesaj yaz..."
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Gönder
        </button>
      </div>
    </main>
  );
}
