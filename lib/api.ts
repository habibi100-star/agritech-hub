import { articles, categories, glossary } from "@/data/dummy";
import { getInitialLetter } from "@/lib/glossary-utils";
import type { Article, Category, GlossaryItem } from "@/types";

// Mengambil artikel terbaru yang sudah terbit.
// Input: limit (jumlah artikel maksimal, bawaan 6).
// Output: Promise berisi daftar Article, diurutkan dari yang terbaru.
export async function getLatestArticles(limit = 6): Promise<Article[]> {
  try {
    return articles
      .filter((article) => article.published)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  } catch {
    throw new Error("Gagal memuat artikel terbaru. Silakan coba lagi.");
  }
}

// Mengambil kategori unggulan untuk beranda.
// Input: tidak ada.
// Output: Promise berisi daftar Category.
export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    return categories;
  } catch {
    throw new Error("Gagal memuat kategori. Silakan coba lagi.");
  }
}

// Menghitung jumlah artikel terbit pada satu kategori.
// Input: categoryId (id kategori).
// Output: Promise berisi angka jumlah artikel.
export async function getArticleCountByCategory(
  categoryId: string,
): Promise<number> {
  try {
    return articles.filter(
      (article) => article.published && article.categoryId === categoryId,
    ).length;
  } catch {
    throw new Error("Gagal menghitung jumlah artikel. Silakan coba lagi.");
  }
}

// Mengambil semua artikel yang sudah terbit.
// Input: tidak ada.
// Output: Promise berisi daftar Article, diurutkan dari yang terbaru.
export async function getAllArticles(): Promise<Article[]> {
  try {
    return articles
      .filter((article) => article.published)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    throw new Error("Gagal memuat daftar artikel. Silakan coba lagi.");
  }
}

// Mencari satu artikel terbit berdasarkan slug.
// Input: slug (bagian alamat artikel, contoh: "sensor-kelembapan-tanah").
// Output: Promise berisi Article, atau null jika tidak ditemukan.
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return (
      articles.find((article) => article.published && article.slug === slug) ??
      null
    );
  } catch {
    throw new Error("Gagal memuat artikel. Silakan coba lagi.");
  }
}

// Mengambil semua kategori.
// Input: tidak ada.
// Output: Promise berisi daftar Category.
export async function getAllCategories(): Promise<Category[]> {
  try {
    return categories;
  } catch {
    throw new Error("Gagal memuat kategori. Silakan coba lagi.");
  }
}

// Mencari satu kategori berdasarkan slug.
// Input: slug (contoh: "hidroponik").
// Output: Promise berisi Category, atau null jika tidak ditemukan.
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    return categories.find((category) => category.slug === slug) ?? null;
  } catch {
    throw new Error("Gagal memuat kategori. Silakan coba lagi.");
  }
}

// Mengambil artikel terkait: kategori yang sama didahulukan, lalu dilengkapi
// artikel terbaru dari kategori lain jika masih kurang dari limit.
// Input: article (artikel yang sedang dibuka), limit (maksimal, bawaan 3).
// Output: Promise berisi daftar Article, tanpa artikel yang sedang dibuka.
export async function getRelatedArticles(
  article: Article,
  limit = 3,
): Promise<Article[]> {
  try {
    const others = articles
      .filter((item) => item.published && item.id !== article.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const sameCategory = others.filter(
      (item) => item.categoryId === article.categoryId,
    );
    const otherCategories = others.filter(
      (item) => item.categoryId !== article.categoryId,
    );

    return [...sameCategory, ...otherCategories].slice(0, limit);
  } catch {
    throw new Error("Gagal memuat artikel terkait. Silakan coba lagi.");
  }
}

// Mengambil semua istilah glosarium.
// Input: tidak ada.
// Output: Promise berisi daftar GlossaryItem, urut abjad menurut term
// (huruf besar/kecil diabaikan, aturan urutan bahasa Indonesia).
export async function getAllGlossary(): Promise<GlossaryItem[]> {
  try {
    return [...glossary].sort((a, b) =>
      a.term.localeCompare(b.term, "id", { sensitivity: "base" }),
    );
  } catch {
    throw new Error("Gagal memuat glosarium. Silakan coba lagi.");
  }
}

// Mengambil istilah glosarium yang berawalan huruf tertentu.
// Input: letter (huruf, contoh: "S" atau "s"; huruf kecil dan beraksen diterima).
// Output: Promise berisi daftar GlossaryItem berawalan huruf itu, urut abjad.
export async function getGlossaryByLetter(
  letter: string,
): Promise<GlossaryItem[]> {
  try {
    const target = getInitialLetter(letter);
    return [...glossary]
      .filter((item) => getInitialLetter(item.term) === target)
      .sort((a, b) =>
        a.term.localeCompare(b.term, "id", { sensitivity: "base" }),
      );
  } catch {
    throw new Error("Gagal memuat glosarium. Silakan coba lagi.");
  }
}