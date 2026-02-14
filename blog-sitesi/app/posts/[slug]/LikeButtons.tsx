"use client";

import { useEffect, useState } from "react";

type Props = {
  postId: string;
};

export default function LikeButtons({ postId }: Props) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/posts/like?postId=${postId}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLoading(false);
    } catch (error) {
      console.error("Like fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const react = async (
    type: "LIKE" | "DISLIKE",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); 
    setReacting(true);

    try {
      await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, type }),
      });
      await fetchReactions();
    } catch (error) {
      console.error("Like POST error:", error);
    } finally {
      setReacting(false);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={(e) => react("LIKE", e)}
        disabled={reacting}
        className="px-4 py-2 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
      >
        👍 <span className="dark:text-black">{likes}</span>
      </button>

      <button
        onClick={(e) => react("DISLIKE", e)}
        disabled={reacting}
        className="px-4 py-2 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50"
      >
        👎 <span className="dark:text-black">{dislikes}</span>
      </button>
    </div>
  );
}
