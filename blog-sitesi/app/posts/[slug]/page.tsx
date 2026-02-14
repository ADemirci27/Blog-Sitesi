import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostActions from "./PostActions";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import LikeButtons from "./LikeButtons";
import Comments from "./Comments";

type PostProps = {
  params: { slug: string };
};

export default async function PostDetailPage({ params }: PostProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) {
    return <p className="text-center">Henüz yazı yok.</p>;
  }

  // Giriş yapan kullanıcıyı bulma
  let currentUserId: string | null = null;

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (token && process.env.JWT_SECRET) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.userId;
    } catch (error) {
      currentUserId = null;
    }
  }

  const isOwner = currentUserId === post.authorId;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {post.title}
      </h1>

      <p className="mb-2 text-gray-900 dark:text-white">
        Yazan Kullanıcı:{" "}
        <Link
          href={`/users/${post.author.username}`}
          className="text-blue-700 dark:text-blue-300 hover:underline font-semibold cursor-pointer"
        >
          {post.author.username}
        </Link>
      </p>

      <p className="mb-4 text-gray-800 dark:text-gray-200">
        {post.createdAt.toLocaleString()}
      </p>

      <div className="mb-4 whitespace-pre-line text-gray-900 dark:text-gray-100 leading-relaxed">
        {post.content}
      </div>

      <Link href={`/?tag=${post.tag}`}>
        <p className="text-sm text-right bg-gray-200 dark:bg-gray-700 p-2 rounded text-blue-700 dark:text-blue-300 font-semibold cursor-pointer hover:underline">
          #{post.tag}
        </p>
      </Link>

      {/* 👍 LIKE / 👎 DISLIKE BÖLÜMÜ */}
      <div className="mt-6">
        <LikeButtons postId={post.id} />
      </div>

      {/* SADECE YAZININ SAHİBİ İSE BUTONLARI GÖSTER */}
      {isOwner && (
        <div className="flex gap-4 mt-6">
          <Link
            href={`/posts/${post.slug}/edit`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Düzenle
          </Link>

          <PostActions
            postId={post.id}
            authorId={post.authorId}
            currentUserId={currentUserId}
          />
        </div>
      )}

      {/* 💬 YORUM BÖLÜMÜ */}
      <div className="mt-10">
        <Comments postId={post.id} currentUserId={currentUserId} />
      </div>
    </main>
  );
}
