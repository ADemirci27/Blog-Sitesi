"use client";

import { useEffect, useState } from "react";

export default function Comments({ imageId }: { imageId: string }) {
  const [image, setImage] = useState<any>(null);
  const [content, setContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const loadImage = async () => {
    const res = await fetch(`/api/images/${imageId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setImage(data);
  };

  useEffect(() => {
    loadImage();

    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) {
          setCurrentUserId(data.user.id);
        }
      });
  }, [imageId]);

  const addComment = async () => {
    if (!content.trim()) return;

    await fetch("/api/image-comments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId, content }),
    });

    setContent("");
    loadImage();
  };

  const deleteComment = async (id: string) => {
    await fetch("/api/image-comments/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadImage();
  };

  const startEdit = (comment: any) => {
    setEditingId(comment.id);
    setEditingText(comment.content);
  };

  const saveEdit = async () => {
    await fetch("/api/image-comments/edit", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        content: editingText,
      }),
    });

    setEditingId(null);
    setEditingText("");
    loadImage();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Yorumlar
      </h2>

      {currentUserId && (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 mb-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded"
          />

          <button
            onClick={addComment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Yorum Yap
          </button>
        </>
      )}

      <div className="mt-4">
        {image?.comments?.map((c: any) => {
          
          const isOwner =
            String(currentUserId) === String(c.user.id);

          return (
            <div
              key={c.id}
              className="border p-3 my-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <p className="text-gray-900 dark:text-white font-semibold">
                {c.user.username}
              </p>

              {editingId === c.id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full border p-2 mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded"
                  />

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Kaydet
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      İptal
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-800 dark:text-gray-200 mt-1">
                  {c.content}
                </p>
              )}

              {isOwner && editingId !== c.id && (
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-blue-600 dark:text-blue-400 text-sm"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-red-600 text-sm"
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
