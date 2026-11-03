import type { Metadata } from "next";
import WeatherExplorer from "@/components/WeatherExplorer";
import { PRESET_LOCATIONS } from "@/data/locations";

// Teks bagian "Sumber data". Edit di sini bila perlu.
const DATA_SOURCE_FORECAST =
  "Data prakiraan berasal dari Open-Meteo. Ini adalah prakiraan model, sehingga bisa berbeda dari kondisi nyata di lapangan.";
const DATA_SOURCE_OFFICIAL =
  "Untuk informasi resmi dan peringatan dini cuaca di Indonesia, rujuk BMKG.";
const DATA_SOURCE_LINKS = [
  { label: "Open-Meteo", href: "https://open-meteo.com" },
  { label: "BMKG", href: "https://www.bmkg.go.id" },
];

export const metadata: Metadata = {
  title: "Cuaca | AgriTech Hub",
  description:
    "Cuaca saat ini dan prakiraan 7 hari untuk kota pilihan di Indonesia: suhu, kelembapan, hujan, dan angin.",
};

// Halaman Cuaca. Server hanya menyerahkan daftar kota preset; pengambilan
// data cuaca dilakukan di komponen client (WeatherExplorer) lewat /api/weather.
// Input: tidak ada.
// Output: halaman berisi judul, WeatherExplorer, dan catatan sumber data.
export default function CuacaPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <span
          aria-hidden="true"
          className="mb-3 block h-1 w-12 rounded-full bg-accent"
        />
        <h1 className="text-3xl font-bold sm:text-4xl">Cuaca dan Prakiraan</h1>
        <p className="mt-3 text-text-muted">
          Lihat kondisi cuaca saat ini dan prakiraan tujuh hari ke depan. Pilih
          salah satu kota atau cari kota lain.
        </p>
      </header>

      <WeatherExplorer locations={PRESET_LOCATIONS} />

      <section
        aria-labelledby="judul-sumber-data"
        className="mt-12 rounded-2xl border border-border bg-surface p-6"
      >
        <h2 id="judul-sumber-data" className="text-xl font-bold">
          Sumber data
        </h2>
        <p className="mt-3 text-text-muted">{DATA_SOURCE_FORECAST}</p>
        <p className="mt-2 text-text-muted">{DATA_SOURCE_OFFICIAL}</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {DATA_SOURCE_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
              >
                {link.label}
                <span className="sr-only"> (buka di tab baru)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}