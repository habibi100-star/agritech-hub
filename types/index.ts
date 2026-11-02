// Tipe data bersama untuk seluruh proyek AgriTech Hub.

// Satu artikel di website.
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // isi artikel; antarparagraf dipisah satu baris kosong ("\n\n")
  categoryId: string;
  coverUrl: string;
  published: boolean;
  createdAt: string; // format tanggal ISO, contoh: "2026-10-28"
};

// Satu kategori artikel.
export type Category = {
  id: string;
  name: string;
  slug: string;
};

// Satu istilah di halaman Glosarium.
export type GlossaryItem = {
  id: string;
  term: string;
  slug: string;
  definition: string;
  relatedCategoryId: string; // merujuk ke id kategori, contoh: "kat-1"
};