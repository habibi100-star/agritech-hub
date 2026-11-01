import Link from "next/link";
import type { Article } from "@/types";

// Mengubah tanggal ISO menjadi teks Indonesia, contoh: "28 Oktober 2026".
// Input: isoDate (string tanggal ISO).
// Output: string tanggal yang mudah dibaca.
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

// Kartu satu artikel: sampul placeholder, kategori, judul, ringkasan, tanggal.
// Input: article (data artikel), categoryName (nama kategorinya).
// Output: elemen <article> yang seluruh areanya bisa diklik.
export default function ArticleCard({
  article,
  categoryName,
}: {
  article: Article;
  categoryName: string;
}) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary">
      {/* Sampul placeholder (dekoratif, jadi disembunyikan dari pembaca layar) */}
      <div
        aria-hidden="true"
        className="flex aspect-video items-center justify-center bg-primary/10 text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22v-8" />
          <path d="M12 14c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5Z" />
          <path d="M12 16c0-3-2-5-6-5 0 3 2 5 6 5Z" />
        </svg>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {categoryName}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug">
          <Link
            href={`/artikel/${article.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">
          {article.excerpt}
        </p>
        <time
          dateTime={article.createdAt}
          className="mt-auto pt-4 text-xs text-text-muted"
        >
          {formatDate(article.createdAt)}
        </time>
      </div>
    </article>
  );
}