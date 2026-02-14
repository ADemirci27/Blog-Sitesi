"use client";

import { useEffect, useState } from "react";

export default function ImageLikeButtons({ imageId }: { imageId: string }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/image-reactions?imageId=${imageId}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
      })
      .catch((err) => {
        console.error("Reaksiyon getirme hatası:", err);
      });
  }, [imageId]);

  const react = async (type: "LIKE" | "DISLIKE") => {
    try {
      setLoading(true);

      await fetch("/api/image-reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId,
          type,
        }),
      });

      const res = await fetch(`/api/image-reactions?imageId=${imageId}`);
      const data = await res.json();

      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
    } catch (error) {
      console.error("Like/Dislike hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center mt-4">
      <button
        onClick={() => react("LIKE")}
        className="text-green-600 font-bold"
        disabled={loading}
      >
        👍 {likes}
      </button>

      <button
        onClick={() => react("DISLIKE")}
        className="text-red-600 font-bold"
        disabled={loading}
      >
        👎 {dislikes}
      </button>
    </div>
  );
}
