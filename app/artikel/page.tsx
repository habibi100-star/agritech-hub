import type { Metadata } from "next";
import { Suspense } from "react";
import ArticleExplorer from "@/components/ArticleExplorer";
import { getAllArticles, getAllCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Daftar Artikel | AgriTech Hub",
  description:
    "Kumpulan artikel teknologi pertanian: IoT, hidroponik, dan irigasi pintar.",
};

// Halaman Daftar Artikel. Data diambil di server, penyaringan dilakukan
// di komponen client (ArticleExplorer) yang dibungkus Suspense.
// Input: tidak ada.
// Output: halaman berisi judul dan daftar artikel.
export default async function ArtikelPage() {
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <span
          aria-hidden="true"
          className="mb-3 block h-1 w-12 rounded-full bg-accent"
        />
        <h1 className="text-3xl font-bold sm:text-4xl">Daftar Artikel</h1>
        <p className="mt-3 text-text-muted">
          Temukan bacaan seputar sensor, hidroponik, dan irigasi pintar. Cari
          berdasarkan judul atau saring menurut kategori.
        </p>
      </header>

      <Suspense
        fallback={
          <p role="status" className="text-text-muted">
            Memuat artikel...
          </p>
        }
      >
        <ArticleExplorer articles={articles} categories={categories} />
      </Suspense>
    </div>
  );
}