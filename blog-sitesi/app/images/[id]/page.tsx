"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageLikeButtons from "./ImageLikeButtons";
import Link from "next/link";

type Image = {
  id: string;
  url: string;
  name: string;
  description?: string;
  tag?: string;
  user?: {
    id: string;
    username: string;
  };
};

type Comment = {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
  };
};

export default function ImageDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [image, setImage] = useState<Image | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) setCurrentUserId(data.user.id);
      });

    fetch(`/api/images/${params.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setImage(data);
        setDescriptionText(data?.description || "");
      });

    loadComments();
  }, [params.id]);

  const loadComments = () => {
    fetch(`/api/image-comments?imageId=${params.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setComments)
      .catch(() => setComments([]));
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    await fetch("/api/image-comments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: params.id, content: newComment }),
    });
    setNewComment("");
    loadComments();
  };

  const deleteComment = async (id: string) => {
    await fetch("/api/image-comments/delete", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadComments();
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingText(comment.content);
  };

  const saveEdit = async () => {
    await fetch("/api/image-comments/edit", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, content: editingText }),
    });
    setEditingId(null);
    setEditingText("");
    loadComments();
  };

  const saveDescription = async () => {
    await fetch("/api/images/description/edit", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: image?.id, description: descriptionText }),
    });
    setEditingDescription(false);
    setImage((prev) => (prev ? { ...prev, description: descriptionText } : prev));
  };

  const deleteDescription = async () => {
    await fetch("/api/images/description/delete", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: image?.id }),
    });
    setImage((prev) => (prev ? { ...prev, description: "" } : prev));
  };

  const isOwner =
    image?.user?.id && currentUserId ? String(image.user.id) === String(currentUserId) : false;

  const deleteImage = async () => {
    const ok = confirm("Bu fotoğrafı silmek istediğine emin misin?");
    if (!ok) return;

    const res = await fetch(`/api/images/${params.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      alert("Fotoğraf silindi");
      router.push("/");
    } else alert("Fotoğraf silinemedi");
  };

  if (!image) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{image.name}</h1>

      {/* Kullanıcı ve Etiket (tıklanabilir etiket) */}
      <div className="flex justify-between mb-2 text-sm text-gray-700 dark:text-gray-300">
        <span>
          Paylaşan:{" "}
          {image.user ? (
            <Link
              href={`/users/${image.user.username}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {image.user.username}
            </Link>
          ) : (
            "Bilinmiyor"
          )}
        </span>
        <span>
          🏷️{" "}
          {image.tag ? (
            <Link
              href={`/?tag=${image.tag}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {image.tag}
            </Link>
          ) : (
            "Etiket yok"
          )}
        </span>
      </div>

      <img src={image.url} className="w-full rounded-lg mb-4 shadow" />

      {/* Açıklama Bloğu */}
      {editingDescription ? (
        <div className="mb-4 p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <textarea
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            className="w-full border p-2 rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={saveDescription} className="bg-green-600 text-white px-3 py-1 rounded">
              Kaydet
            </button>
            <button
              onClick={() => setEditingDescription(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        image.description && (
          <div className="mb-4 p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-200">{image.description}</p>
            {isOwner && (
              <div className="flex gap-3 mt-2 text-sm">
                <button
                  onClick={() => setEditingDescription(true)}
                  className="text-blue-600 hover:underline"
                >
                  Açıklamayı Düzenle
                </button>
                <button onClick={deleteDescription} className="text-red-600 hover:underline">
                  Açıklamayı Sil
                </button>
              </div>
            )}
          </div>
        )
      )}

      <div className="mb-4">
        <ImageLikeButtons imageId={image.id} />
      </div>

      {isOwner && (
        <button
          onClick={deleteImage}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-6 transition"
        >
          Fotoğrafı Sil
        </button>
      )}

      {/* Yorumlar */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Yorumlar</h2>

        {currentUserId && (
          <div className="mb-4">
            <textarea
              className="w-full border p-2 rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Yorum yaz..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={addComment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 transition"
            >
              Yorum Yap
            </button>
          </div>
        )}

        {comments.map((comment) => {
          const isCommentOwner = String(currentUserId) === String(comment.user.id);
          return (
            <div
              key={comment.id}
              className="border p-3 rounded mb-3 bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.user.username}</p>
              {editingId === comment.id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full border p-2 mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded">
                      Kaydet
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      İptal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{comment.content}</p>
                  {isCommentOwner && (
                    <div className="flex gap-3 mt-2 text-sm">
                      <button
                        onClick={() => startEdit(comment)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Düzenle
                      </button>
                      <button onClick={() => deleteComment(comment.id)} className="text-red-600 hover:underline">
                        Sil
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
