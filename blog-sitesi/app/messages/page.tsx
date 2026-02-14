"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
  }, []);

  const loadCurrentUser = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.user) setCurrentUserId(data.user.id);
  };

  const loadMessages = async () => {
    const res = await fetch("/api/messages/user");
    const data = await res.json();
    setMessages(data);
  };

  const openConversation = async (user: any) => {
    setSelectedUser(user);
    const res = await fetch(`/api/messages/conversation/${user.id}`);
    const data = await res.json();
    setConversation(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: selectedUser.id,
        content: newMessage,
      }),
    });

    setNewMessage("");
    openConversation(selectedUser);
    loadMessages();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUniqueConversations = () => {
    const map = new Map<string, any>();
    messages.forEach((msg) => {
      const otherUser =
        msg.senderId === currentUserId
          ? msg.receiver
          : msg.sender;
      if (!otherUser || otherUser.id === currentUserId) return;
      if (!map.has(otherUser.id)) map.set(otherUser.id, otherUser);
    });
    return Array.from(map.values());
  };

  const uniqueUsers = getUniqueConversations();

  return (
    <main className="max-w-5xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
        Mesajlarım
      </h1>

      <div className="grid grid-cols-3 gap-4 h-[600px]">
        
        <div className="border rounded-xl bg-white dark:bg-gray-800 p-3 flex flex-col">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Konuşmalar
          </h2>

          <div className="flex-1 overflow-y-auto space-y-1">
            {uniqueUsers.map((user, index) => (
              <div
                key={index}
                onClick={() => openConversation(user)}
                className="
                  cursor-pointer p-2 rounded-lg
                  text-gray-900 dark:text-gray-100
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition
                "
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>

        
        <div className="col-span-2 border rounded-xl bg-white dark:bg-gray-800 p-3 flex flex-col">
          {selectedUser ? (
            <>
              <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {selectedUser.username} ile konuşma
              </h2>

              
              <div className="flex-1 overflow-y-auto p-2 mb-2 space-y-2 border rounded-lg">
                {conversation.map((c, i) => {
                  const isMe = c.senderId === currentUserId;
                  return (
                    <div
                      key={i}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          px-4 py-2 rounded-2xl max-w-xs
                          ${isMe
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}
                        `}
                      >
                        {c.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <textarea
                className="
                  w-full border p-2.5 rounded-2xl mb-2
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                  resize-none
                "
                placeholder="Mesajınızı yazın..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
              />

              <button
                onClick={sendMessage}
                className="
                  self-end px-6 py-2 rounded-full
                  bg-blue-600 hover:bg-blue-700 text-white
                  font-semibold transition
                "
              >
                Gönder
              </button>
            </>
          ) : (
            <p className="text-gray-900 dark:text-gray-100 text-center mt-20">
              Konuşma seçiniz
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
