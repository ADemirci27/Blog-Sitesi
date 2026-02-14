"use client";

import { useEffect, useState } from "react";

export default function Comments({ postId, currentUserId }: { postId: string, currentUserId: string | null }) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const loadComments = async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const addComment = async () => {
    if (!content.trim()) return;

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content }),
    });

    setContent("");
    loadComments();
  };

  const deleteComment = async (id: string) => {
    await fetch("/api/comments/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadComments();
  };

  const updateComment = async (id: string) => {
    await fetch("/api/comments/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content: editContent }),
    });

    setEditingId(null);
    setEditContent("");
    loadComments();
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Yorumlar
      </h2>

      {currentUserId && (
        <>
          <textarea
            className="w-full border p-2 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addComment();
              }
            }}
            placeholder="Yorum yaz..."
          />

          <button
            onClick={addComment}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Yorum Yap
          </button>
        </>
      )}

      <div className="mt-6 space-y-4">
        {comments.map((c) => {
          const isOwner = currentUserId === c.userId;

          return (
            <div
              key={c.id}
              className="border p-3 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <b className="text-gray-800 dark:text-gray-200">
                {c.user.username}
              </b>

              {editingId === c.id ? (
                <>
                  <textarea
                    className="w-full border p-2 mt-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <button
                    onClick={() => updateComment(c.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded mt-2"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    className="bg-gray-400 text-white px-3 py-1 rounded mt-2 ml-2"
                  >
                    İptal
                  </button>
                </>
              ) : (
                <p className="text-gray-800 dark:text-gray-200 mt-1">
                  {c.content}
                </p>
              )}

              
              {isOwner && editingId !== c.id && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditContent(c.content);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
