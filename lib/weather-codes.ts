// Terjemahan kode cuaca WMO ke teks Indonesia dan nama ikon sederhana.
// File ini murni (tanpa fetch), jadi aman diimpor komponen client.

const UNKNOWN_WEATHER = { label: "Tidak diketahui", icon: "tidak-diketahui" };

// Tabel kode cuaca WMO -> teks dan ikon. Ikon yang dipakai: "cerah",
// "berawan", "kabut", "gerimis", "hujan", "salju", "badai".
const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Cerah", icon: "cerah" },
  1: { label: "Sebagian besar cerah", icon: "cerah" },
  2: { label: "Berawan sebagian", icon: "berawan" },
  3: { label: "Mendung", icon: "berawan" },
  45: { label: "Berkabut", icon: "kabut" },
  48: { label: "Kabut berembun beku", icon: "kabut" },
  51: { label: "Gerimis ringan", icon: "gerimis" },
  53: { label: "Gerimis sedang", icon: "gerimis" },
  55: { label: "Gerimis lebat", icon: "gerimis" },
  56: { label: "Gerimis beku ringan", icon: "gerimis" },
  57: { label: "Gerimis beku lebat", icon: "gerimis" },
  61: { label: "Hujan ringan", icon: "hujan" },
  63: { label: "Hujan sedang", icon: "hujan" },
  65: { label: "Hujan lebat", icon: "hujan" },
  66: { label: "Hujan beku ringan", icon: "hujan" },
  67: { label: "Hujan beku lebat", icon: "hujan" },
  71: { label: "Salju ringan", icon: "salju" },
  73: { label: "Salju sedang", icon: "salju" },
  75: { label: "Salju lebat", icon: "salju" },
  77: { label: "Butiran salju", icon: "salju" },
  80: { label: "Hujan sesaat ringan", icon: "hujan" },
  81: { label: "Hujan sesaat sedang", icon: "hujan" },
  82: { label: "Hujan sesaat deras", icon: "hujan" },
  85: { label: "Hujan salju sesaat ringan", icon: "salju" },
  86: { label: "Hujan salju sesaat lebat", icon: "salju" },
  95: { label: "Badai petir", icon: "badai" },
  96: { label: "Badai petir dengan hujan es ringan", icon: "badai" },
  99: { label: "Badai petir dengan hujan es lebat", icon: "badai" },
};

// Menerjemahkan kode cuaca WMO menjadi teks dan nama ikon.
// Input: code (angka kode cuaca, contoh: 61).
// Output: objek { label, icon }, contoh: { label: "Hujan ringan", icon: "hujan" }.
// Kode yang tidak dikenal menghasilkan { label: "Tidak diketahui", icon: "tidak-diketahui" }.
export function describeWeatherCode(code: number): {
  label: string;
  icon: string;
} {
  return WEATHER_CODES[code] ?? UNKNOWN_WEATHER;
}