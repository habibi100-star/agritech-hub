"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import type { Article, Category } from "@/types";

const baseFilterStyle =
  "inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors";

// Memilih kelas gaya untuk tombol filter.
// Input: isActive (true jika filter sedang dipilih).
// Output: string kelas Tailwind.
function getFilterClass(isActive: boolean): string {
  return isActive
    ? `${baseFilterStyle} border-primary bg-primary text-white`
    : `${baseFilterStyle} border-border bg-surface text-text hover:border-primary hover:text-primary`;
}

// Bagian interaktif halaman Daftar Artikel: filter kategori (lewat ?kategori=),
// kotak pencarian judul, jumlah hasil, grid kartu, dan tampilan kosong.
// Input: articles (semua artikel), categories (semua kategori).
// Output: elemen filter, jumlah hasil, dan grid artikel.
export default function ArticleExplorer({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  // Kategori aktif diambil dari alamat (?kategori=...). Slug asing dianggap "Semua".
  const categorySlug = searchParams.get("kategori");
  const activeCategory =
    categories.find((category) => category.slug === categorySlug) ?? null;

  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const keyword = query.trim().toLowerCase();
  const filteredArticles = articles.filter((article) => {
    const matchCategory = activeCategory
      ? article.categoryId === activeCategory.id
      : true;
    const matchTitle =
      keyword === "" ? true : article.title.toLowerCase().includes(keyword);
    return matchCategory && matchTitle;
  });

  // Mengubah kategori aktif dengan memperbarui alamat halaman.
  // Input: slug (slug kategori, atau null untuk "Semua").
  // Output: tidak ada (alamat berubah, halaman tidak scroll ke atas).
  function selectCategory(slug: string | null) {
    const url = slug ? `${pathname}?kategori=${slug}` : pathname;
    router.replace(url, { scroll: false });
  }

  // Mengosongkan pencarian dan kembali ke semua kategori.
  // Input: tidak ada.
  // Output: tidak ada.
  function resetFilters() {
    setQuery("");
    selectCategory(null);
  }

  const resultText =
    filteredArticles.length === 0
      ? "Tidak ada artikel yang cocok."
      : `Menampilkan ${filteredArticles.length} artikel${
          activeCategory ? ` dalam kategori ${activeCategory.name}` : ""
        }.`;

  return (
    <div>
      <div role="search" aria-label="Cari dan saring artikel">
        <label
          htmlFor="cari-artikel"
          className="block text-sm font-semibold text-primary-dark"
        >
          Cari judul artikel
        </label>
        <input
          id="cari-artikel"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Contoh: hidroponik"
          className="mt-2 h-12 w-full rounded-full border border-border bg-surface px-5 text-base text-text placeholder:text-text-muted sm:max-w-md"
        />

        <p
          id="label-kategori"
          className="mt-6 text-sm font-semibold text-primary-dark"
        >
          Kategori
        </p>
        <div
          role="group"
          aria-labelledby="label-kategori"
          className="mt-2 flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={activeCategory === null}
            onClick={() => selectCategory(null)}
            className={getFilterClass(activeCategory === null)}
          >
            Semua
          </button>
          {categories.map((category) => {
            const isActive = activeCategory?.id === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectCategory(category.slug)}
                className={getFilterClass(isActive)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pembaca layar akan membacakan teks ini setiap kali hasil berubah */}
      <p
        role="status"
        aria-live="polite"
        className="mt-8 text-sm text-text-muted"
      >
        {resultText}
      </p>

      <h2 className="sr-only">Hasil artikel</h2>

      {filteredArticles.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              categoryName={categoryNames.get(article.categoryId) ?? "Umum"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <h3 className="text-xl font-bold">Artikel tidak ditemukan</h3>
          <p className="mx-auto mt-2 max-w-md text-text-muted">
            Coba kata kunci lain atau pilih kategori yang berbeda.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Atur ulang filter
          </button>
        </div>
      )}
    </div>
  );
}