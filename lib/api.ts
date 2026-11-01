import { articles, categories } from "@/data/dummy";
import type { Article, Category } from "@/types";

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