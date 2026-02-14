"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Lütfen dosya seçin");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("tag", tag);

    setLoading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setUploadedImage(data);
      setDescription("");
      setTag("");
      setFile(null);
      alert("Görsel başarıyla yüklendi ve kaydedildi!");
    } else {
      alert("Yükleme başarısız");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
        Görsel İçerik Oluştur
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col gap-4">

        
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="
            border p-2.5 rounded-full
            bg-gray-50 dark:bg-gray-700
            cursor-pointer
            text-sm
          "
        />

        
        <input
          type="text"
          placeholder="Etiket gir (örnek: doğa, teknoloji...)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="
            border p-2.5 rounded-full
            bg-gray-50 dark:bg-gray-700
            placeholder-gray-400 dark:placeholder-gray-500
            text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transition
          "
        />

        
        <textarea
          placeholder="Görsel açıklamasını buraya yaz..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="
            border p-2.5 rounded-2xl
            bg-gray-50 dark:bg-gray-700
            placeholder-gray-400 dark:placeholder-gray-500
            text-sm
            min-h-[120px]
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transition
          "
        />

        
        <button
          onClick={handleUpload}
          className={`
            w-full py-2.5 rounded-full text-white font-semibold text-sm
            shadow-md transition-all duration-200
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"}
          `}
          disabled={loading}
        >
          {loading ? "Yükleniyor..." : "Görseli Yükle"}
        </button>
      </div>

      
      {uploadedImage && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Yüklenen Görsel:</p>

          <img
            src={uploadedImage.url}
            className="max-w-full rounded-xl shadow mb-4"
          />

          {uploadedImage.tag && (
            <p className="text-blue-600 dark:text-blue-400 mb-2 text-sm">
              #{uploadedImage.tag}
            </p>
          )}

          {uploadedImage.description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {uploadedImage.description}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
