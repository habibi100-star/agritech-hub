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

// Satu istilah di halaman Glosarium.
export type GlossaryItem = {
  id: string;
  term: string;
  slug: string;
  definition: string;
  relatedCategoryId: string; // merujuk ke id kategori, contoh: "kat-1"
};

// Satu lokasi (kota) untuk cuaca.
export type Location = {
  id: string;
  name: string;
  region: string; // provinsi (admin1); string kosong bila tidak diketahui
  country: string; // string kosong bila tidak diketahui
  latitude: number;
  longitude: number;
};

// Kondisi cuaca saat ini.
export type CurrentWeather = {
  temperatureC: number;
  apparentTemperatureC: number; // suhu yang terasa
  humidityPercent: number;
  precipitationMm: number;
  windSpeedKmh: number;
  weatherCode: number; // kode cuaca WMO, diterjemahkan lewat describeWeatherCode
  time: string; // waktu setempat lokasi, contoh: "2026-11-03T14:00"
};

// Prakiraan untuk satu hari.
export type DailyForecast = {
  date: string; // format ISO, contoh: "2026-11-03"
  weatherCode: number;
  tempMaxC: number;
  tempMinC: number;
  precipitationSumMm: number;
  precipitationProbabilityPercent: number | null; // null bila data tidak tersedia
};

// Laporan cuaca lengkap untuk satu lokasi.
export type WeatherReport = {
  location: Location;
  current: CurrentWeather;
  daily: DailyForecast[];
};

// Bentuk respons error dari route API internal (pesan bahasa Indonesia).
export type ApiError = {
  error: string;
};