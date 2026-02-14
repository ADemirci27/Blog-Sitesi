"use client";

import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  authorId: string;
  currentUserId: string | null;
};

export default function PostActions({
  postId,
  authorId,
  currentUserId,
}: Props) {
  const router = useRouter();

  
  if (!currentUserId || currentUserId !== authorId) {
    return null;
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) router.push("/");
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sil
      </button>
    </div>
  );
}
