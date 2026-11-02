import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import {
  getAllArticles,
  getAllCategories,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/api";
import { formatDate, getReadingMinutes } from "@/lib/format";

// Di Next.js 16, params berupa Promise sehingga harus di-await.
type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

// Memberi tahu Next.js daftar slug yang dibuat saat build.
// Input: tidak ada.
// Output: Promise berisi daftar { slug } dari semua artikel.
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

// Membuat judul dan deskripsi halaman (tab browser dan mesin pencari).
// Input: props berisi params (slug).
// Output: Promise berisi objek Metadata.
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel tidak ditemukan | AgriTech Hub" };
  }

  return {
    title: `${article.title} | AgriTech Hub`,
    description: article.excerpt,
  };
}

// Halaman Detail Artikel.
// Input: props berisi params (slug).
// Output: halaman artikel lengkap; menampilkan 404 jika slug tidak ada.
export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [categories, relatedArticles] = await Promise.all([
    getAllCategories(),
    getRelatedArticles(article, 3),
  ]);

  const category = categories.find((item) => item.id === article.categoryId);
  const categoryNames = new Map(
    categories.map((item) => [item.id, item.name]),
  );
  const paragraphs = article.content.split("\n\n");
  const readingMinutes = getReadingMinutes(article.content);

  return (
    <>
      <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Artikel", href: "/artikel" },
            { label: article.title },
          ]}
        />

        <header className="mx-auto mt-8 max-w-3xl">
          {category ? (
            <Link
              href={`/artikel?kategori=${category.slug}`}
              className="inline-block py-1 text-xs font-semibold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
            >
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 text-sm text-text-muted">
            <time dateTime={article.createdAt}>
              {formatDate(article.createdAt)}
            </time>
            <span aria-hidden="true">•</span>
            <span>Perkiraan {readingMinutes} menit baca</span>
          </p>
        </header>

        {/* Sampul placeholder (dekoratif, disembunyikan dari pembaca layar) */}
        <div
          aria-hidden="true"
          className="mx-auto mt-8 flex aspect-video max-w-3xl items-center justify-center rounded-3xl bg-primary/10 text-primary"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-16 w-16"
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

        <div className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-8 text-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <Button href="/artikel" variant="outline">
            Kembali ke Daftar Artikel
          </Button>
        </div>
      </article>

      {relatedArticles.length > 0 ? (
        <section
          aria-labelledby="judul-terkait"
          className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <SectionHeading
            id="judul-terkait"
            title="Artikel terkait"
            description="Bacaan lain yang mungkin kamu sukai."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.id}
                article={related}
                categoryName={categoryNames.get(related.categoryId) ?? "Umum"}
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}