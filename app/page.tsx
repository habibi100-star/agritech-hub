import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import ArticleCard from "@/components/ArticleCard";
import {
  getArticleCountByCategory,
  getFeaturedCategories,
  getLatestArticles,
} from "@/lib/api";

// Halaman beranda. Data diambil lewat lib/api.ts (sementara dari data palsu).
// Input: tidak ada.
// Output: halaman beranda berisi hero, kategori, artikel terbaru, dan ajakan.
export default async function Home() {
  const [articles, categories] = await Promise.all([
    getLatestArticles(6),
    getFeaturedCategories(),
  ]);
  const counts = await Promise.all(
    categories.map((category) => getArticleCountByCategory(category.id)),
  );
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <>
      {/* 2. Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Teknologi untuk pertanian yang lebih cerdas
            </h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">
              Pelajari sensor, hidroponik, dan irigasi pintar lewat artikel
              singkat yang mudah dipahami petani maupun pelajar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/artikel">Baca Artikel</Button>
              <Button href="/cuaca" variant="outline">
                Lihat Cuaca
              </Button>
            </div>
          </div>

          {/* Area gambar: kotak placeholder */}
          <div
            role="img"
            aria-label="Gambar sementara: ilustrasi lahan pertanian"
            className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary-dark"
          >
            <span
              aria-hidden="true"
              className="absolute right-8 top-8 h-12 w-12 rounded-full bg-accent"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-background/10"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-background/10"
            />
          </div>
        </div>
      </section>

      {/* 3. Kategori unggulan */}
      <section
        aria-labelledby="judul-kategori"
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <SectionHeading
          id="judul-kategori"
          title="Kategori unggulan"
          description="Mulai dari topik yang paling banyak dicari."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              articleCount={counts[index]}
            />
          ))}
        </div>
      </section>

      {/* 4. Artikel terbaru */}
      <section
        aria-labelledby="judul-artikel"
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <SectionHeading
          id="judul-artikel"
          title="Artikel terbaru"
          description="Bacaan baru seputar teknologi pertanian."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              categoryName={categoryNames.get(article.categoryId) ?? "Umum"}
            />
          ))}
        </div>
      </section>

      {/* 5. Blok ajakan kalkulator pupuk */}
      <section
        aria-labelledby="judul-kalkulator"
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-primary-dark px-6 py-12 text-center sm:px-12">
          <h2
            id="judul-kalkulator"
            className="text-3xl font-bold text-background sm:text-4xl"
          >
            Hitung kebutuhan pupuk dengan tepat
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-background/80">
            Masukkan luas lahan dan jenis tanaman, lalu dapatkan perkiraan
            pupuk yang dibutuhkan agar tidak boros.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/alat/kalkulator-pupuk" variant="light">
              Coba Kalkulator Pupuk
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}