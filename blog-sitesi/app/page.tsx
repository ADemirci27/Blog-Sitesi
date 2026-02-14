"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LikeButtons from "./posts/[slug]/LikeButtons";
import ImageLikeButtons from "./images/[id]/ImageLikeButtons";

type Post = {
  id: string;
  title: string;
  slug: string;
  tag: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
};

type Image = {
  id: string;
  url: string;
  name: string;
  description?: string;
  tag?: string;
  user?: {
    username: string;
  };
  createdAt: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  useEffect(() => {
    fetch(`/api/posts?page=${currentPage}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (activeTag) {
          const filtered = data.posts.filter(
            (post: Post) => post.tag === activeTag
          );
          setPosts(filtered);
        } else {
          setPosts(data.posts);
        }
        setTotalPages(data.totalPages);
      })
      .catch(() => setPosts([]));
  }, [activeTag, currentPage]);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        let allImages: Image[] = [];

        if (Array.isArray(data)) {
          allImages = data;
        } else if (data && Array.isArray(data.images)) {
          allImages = data.images;
        }

        if (activeTag) {
          const filteredImages = allImages.filter(
            (img: Image) => img.tag === activeTag
          );
          setImages(filteredImages);
        } else {
          setImages(allImages);
        }
      })
      .catch(() => setImages([]));
  }, [activeTag]);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const favIds = data.map((fav: any) =>
          fav.postId ? fav.postId : fav.imageId
        );
        setFavorites(favIds);
      });
  }, []);

  const toggleFavorite = async (
    id: string,
    type: "post" | "image",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const body = type === "post" ? { postId: id } : { imageId: id };

    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setFavorites((prev) =>
        prev.includes(id)
          ? prev.filter((favId) => favId !== id)
          : [...prev, id]
      );
    }
  };

  const sortedPosts = [...(posts || [])].sort((a, b) => {
    if (sortType === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortType === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortType === "az") return a.title.localeCompare(b.title);
    if (sortType === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
        {activeTag
          ? `#${activeTag} etiketli tüm içerikler`
          : "Tüm İçerikler"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 flex-1">

      
        {sortedPosts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`}>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md relative cursor-pointer h-[360px] flex flex-col justify-between text-gray-900 dark:text-gray-100 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">

              <button
                onClick={(e) => toggleFavorite(post.id, "post", e)}
                className="absolute top-3 right-3 text-xl"
              >
                {favorites.includes(post.id) ? "❤️" : "🤍"}
              </button>

              <div>
                <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                  {post.title}
                </h2>

                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>👤 {post.author.username}</span>
                  <span>🏷️ {post.tag}</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 line-clamp-4">
                  {post.content}
                </p>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <LikeButtons postId={post.id} />
              </div>
            </div>
          </Link>
        ))}

        
        {images.map((img) => (
          <Link key={img.id} href={`/images/${img.id}`}>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md relative cursor-pointer h-[360px] flex flex-col justify-between text-gray-900 dark:text-gray-100 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">

              <button
                onClick={(e) => toggleFavorite(img.id, "image", e)}
                className="absolute top-3 right-3 text-xl"
              >
                {favorites.includes(img.id) ? "❤️" : "🤍"}
              </button>

              <div>
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                  {img.name}
                </h2>

                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>👤 {img.user?.username || "Bilinmiyor"}</span>
                  <span>🏷️ {img.tag || "Etiket yok"}</span>
                </div>

                
                {img.description && (
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {img.description}
                  </p>
                )}
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <ImageLikeButtons imageId={img.id} />
              </div>
            </div>
          </Link>
        ))}

      </div>
    </main>
  );
}
