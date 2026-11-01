import Link from "next/link";
import type { ReactNode } from "react";
import type { Category } from "@/types";

// Ikon sederhana per kategori (kunci = slug kategori).
const icons: Record<string, ReactNode> = {
  "iot-pertanian": (
    <>
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M8.5 16.1a6 6 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </>
  ),
  hidroponik: (
    <>
      <path d="M12 22v-8" />
      <path d="M12 14c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5Z" />
      <path d="M12 16c0-3-2-5-6-5 0 3 2 5 6 5Z" />
    </>
  ),
  "smart-irrigation": (
    <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />
  ),
};

// Kartu satu kategori unggulan dengan ikon dan jumlah artikel.
// Input: category (data kategori), articleCount (jumlah artikel).
// Output: kartu yang bisa diklik menuju daftar artikel kategori tersebut.
export default function CategoryCard({
  category,
  articleCount,
}: {
  category: Category;
  articleCount: number;
}) {
  return (
    <Link
      href={`/artikel?kategori=${category.slug}`}
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[category.slug] ?? icons.hidroponik}
        </svg>
      </span>
      <span>
        <h3 className="text-lg font-bold">{category.name}</h3>
        <span className="text-sm text-text-muted">{articleCount} artikel</span>
      </span>
    </Link>
  );
}