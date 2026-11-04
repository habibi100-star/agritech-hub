import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FertilizerCalculator from "@/components/FertilizerCalculator";
import { getAllFertilizerPresets } from "@/lib/api";
import type { FertilizerPreset } from "@/types";

export const metadata: Metadata = {
  title: "Kalkulator Pupuk | AgriTech Hub",
  description:
    "Hitung perkiraan awal kebutuhan hara N, P, dan K berdasarkan jenis tanaman dan luas lahan.",
};

// Halaman Kalkulator Pupuk. Data preset diambil di server lalu dikirim
// ke komponen client (FertilizerCalculator) lewat props.
// Input: tidak ada.
// Output: halaman berisi judul, breadcrumb, dan kalkulator.
export default async function PupukPage() {
  let presets: FertilizerPreset[] = [];
  let loadError: string | null = null;

  try {
    presets = await getAllFertilizerPresets();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Gagal memuat data tanaman. Silakan coba lagi.";
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Kalkulator Pupuk" },
        ]}
      />

      <header className="mb-8 mt-6 max-w-2xl">
        <span
          aria-hidden="true"
          className="mb-3 block h-1 w-12 rounded-full bg-accent"
        />
        <h1 className="text-3xl font-bold sm:text-4xl">Kalkulator Pupuk</h1>
        <p className="mt-3 text-text-muted">
          Pilih tanaman dan isi luas lahan untuk melihat perkiraan awal
          kebutuhan hara nitrogen (N), fosfor (P), dan kalium (K).
        </p>
      </header>

      {loadError !== null ? (
        <div
          role="alert"
          className="rounded-2xl border border-error bg-surface p-6"
        >
          <p className="font-bold text-error">Kalkulator tidak bisa dimuat</p>
          <p className="mt-2 text-text">{loadError}</p>
        </div>
      ) : (
        <FertilizerCalculator presets={presets} />
      )}
    </div>
  );
}