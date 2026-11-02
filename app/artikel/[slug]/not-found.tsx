import Button from "@/components/Button";

// Halaman ramah yang tampil saat slug artikel tidak ada (dipanggil oleh notFound()).
// Input: tidak ada.
// Output: pesan "artikel tidak ditemukan" dengan tombol menuju daftar artikel dan beranda.
export default function ArticleNotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Error 404
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        Artikel tidak ditemukan
      </h1>
      <p className="mt-4 text-text-muted">
        Maaf, artikel yang kamu cari mungkin sudah dipindahkan, alamatnya
        berubah, atau memang belum ada. Coba lihat daftar artikel kami.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/artikel">Lihat Semua Artikel</Button>
        <Button href="/" variant="outline">
          Ke Beranda
        </Button>
      </div>
    </section>
  );
}