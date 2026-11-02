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