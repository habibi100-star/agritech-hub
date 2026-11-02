import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import GlossaryExplorer from "@/components/GlossaryExplorer";
import { getAllCategories, getAllGlossary } from "@/lib/api";

export const metadata: Metadata = {
  title: "Glosarium | AgriTech Hub",
  description:
    "Kamus istilah dasar teknologi pertanian: IoT, hidroponik, dan irigasi pintar, dijelaskan dengan bahasa sederhana.",
};

// Halaman Glosarium. Data diambil di server, pencarian dan penyaringan
// dilakukan di komponen client (GlossaryExplorer).
// Input: tidak ada.
// Output: halaman berisi judul, breadcrumb, dan daftar istilah.
export default async function GlosariumPage() {
  const [items, categories] = await Promise.all([
    getAllGlossary(),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Glosarium" }]}
      />

      <header className="mb-8 mt-6 max-w-2xl">
        <span
          aria-hidden="true"
          className="mb-3 block h-1 w-12 rounded-full bg-accent"
        />
        <h1 className="text-3xl font-bold sm:text-4xl">Glosarium</h1>
        <p className="mt-3 text-text-muted">
          Kumpulan istilah dasar teknologi pertanian beserta penjelasan
          singkatnya. Cari istilah, saring menurut kategori, atau lompat lewat
          huruf awalnya.
        </p>
      </header>

      <GlossaryExplorer items={items} categories={categories} />
    </div>
  );
}