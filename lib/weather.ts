// Fungsi cuaca dan pencarian lokasi. HANYA dipakai di server karena
// memanggil Open-Meteo. Komponen client jangan mengimpor file ini; mereka
// cukup memanggil /api/weather dan /api/geocode.
import { cacheLife } from "next/cache";
import type {
  CurrentWeather,
  DailyForecast,
  Location,
  WeatherReport,
} from "@/types";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const TIMEOUT_MS = 8000;
const MAX_LOCATION_RESULTS = 5;

// Memeriksa apakah sebuah nilai adalah objek biasa (bukan null atau array).
// Input: value (nilai apa saja).
// Output: true bila objek biasa.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Membaca angka dari sebuah objek.
// Input: source (objek), key (nama field).
// Output: angka valid. Melempar error bila bukan angka.
function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Data cuaca tidak lengkap: field "${key}" tidak valid.`);
  }
  return value;
}

// Membaca teks dari sebuah objek.
// Input: source (objek), key (nama field).
// Output: string. Melempar error bila bukan teks.
function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  if (typeof value !== "string") {
    throw new Error(`Data cuaca tidak lengkap: field "${key}" tidak valid.`);
  }
  return value;
}

// Membaca array dari sebuah objek.
// Input: source (objek), key (nama field).
// Output: array. Melempar error bila bukan array.
function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  if (!Array.isArray(value)) {
    throw new Error(`Data cuaca tidak lengkap: field "${key}" tidak valid.`);
  }
  return value;
}

// Membaca angka pada urutan tertentu di sebuah array.
// Input: list (array), index (urutan), name (nama field untuk pesan error).
// Output: angka valid. Melempar error bila bukan angka.
function numberAt(list: unknown[], index: number, name: string): number {
  const value = list[index];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Data cuaca tidak lengkap: field "${name}" tidak valid.`);
  }
  return value;
}

// Sama seperti numberAt, tetapi nilai null diterima.
// Input: list (array), index (urutan), name (nama field untuk pesan error).
// Output: angka valid atau null.
function nullableNumberAt(
  list: unknown[],
  index: number,
  name: string,
): number | null {
  return list[index] === null ? null : numberAt(list, index, name);
}

// Membulatkan koordinat ke 2 angka desimal (sekitar 1 km). Ini membuat
// koordinat yang berdekatan memakai cache yang sama dan membatasi jumlah
// entri cache.
// Input: value (koordinat). Output: koordinat yang dibulatkan.
function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

// Mengambil JSON dari sebuah alamat dengan batas waktu 8 detik.
// Input: url (alamat lengkap), serviceName (nama layanan untuk pesan error).
// Output: Promise berisi data JSON (belum divalidasi). Melempar error bila
// jaringan gagal, status bukan 2xx, atau balasan bukan JSON.
async function fetchJson(url: string, serviceName: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    throw new Error(
      `Tidak bisa terhubung ke layanan ${serviceName} (jaringan terputus atau waktu habis).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Layanan ${serviceName} membalas dengan kode ${response.status}.`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`Balasan layanan ${serviceName} bukan JSON yang valid.`);
  }
}

// Memetakan objek "current" dari Open-Meteo ke CurrentWeather.
// Input: raw (data mentah, belum tentu valid).
// Output: CurrentWeather. Melempar error bila ada field yang hilang atau salah bentuk.
function parseCurrent(raw: unknown): CurrentWeather {
  if (!isRecord(raw)) {
    throw new Error("Data cuaca saat ini tidak ditemukan.");
  }
  return {
    temperatureC: readNumber(raw, "temperature_2m"),
    apparentTemperatureC: readNumber(raw, "apparent_temperature"),
    humidityPercent: readNumber(raw, "relative_humidity_2m"),
    precipitationMm: readNumber(raw, "precipitation"),
    windSpeedKmh: readNumber(raw, "wind_speed_10m"),
    weatherCode: readNumber(raw, "weather_code"),
    time: readString(raw, "time"),
  };
}

// Memetakan objek "daily" dari Open-Meteo (array sejajar) ke daftar DailyForecast.
// Input: raw (data mentah, belum tentu valid).
// Output: array DailyForecast, satu per hari. Melempar error bila bentuk data salah.
function parseDaily(raw: unknown): DailyForecast[] {
  if (!isRecord(raw)) {
    throw new Error("Data prakiraan harian tidak ditemukan.");
  }

  const times = readArray(raw, "time");
  const codes = readArray(raw, "weather_code");
  const maxes = readArray(raw, "temperature_2m_max");
  const mins = readArray(raw, "temperature_2m_min");
  const sums = readArray(raw, "precipitation_sum");
  const probabilities = readArray(raw, "precipitation_probability_max");

  const sameLength = [codes, maxes, mins, sums, probabilities].every(
    (list) => list.length === times.length,
  );
  if (times.length === 0 || !sameLength) {
    throw new Error("Data prakiraan harian tidak lengkap.");
  }

  return times.map((date, index) => {
    if (typeof date !== "string") {
      throw new Error("Format tanggal prakiraan tidak valid.");
    }
    return {
      date,
      weatherCode: numberAt(codes, index, "weather_code"),
      tempMaxC: numberAt(maxes, index, "temperature_2m_max"),
      tempMinC: numberAt(mins, index, "temperature_2m_min"),
      precipitationSumMm: numberAt(sums, index, "precipitation_sum"),
      precipitationProbabilityPercent: nullableNumberAt(
        probabilities,
        index,
        "precipitation_probability_max",
      ),
    };
  });
}

// Mengambil dan memetakan prakiraan dari Open-Meteo, dengan cache server
// sekitar 10 menit ("use cache"). Fungsi ini sengaja tidak diekspor;
// pakai getWeather.
// Input: latitude dan longitude (sudah dibulatkan).
// Output: Promise berisi WeatherReport. Melempar error bila gagal.
async function loadWeatherReport(
  latitude: number,
  longitude: number,
): Promise<WeatherReport> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 600, expire: 3600 });

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: "auto",
    forecast_days: "7",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
  });

  const data = await fetchJson(`${FORECAST_URL}?${params.toString()}`, "cuaca");
  if (!isRecord(data)) {
    throw new Error("Balasan layanan cuaca tidak sesuai format.");
  }

  return {
    // Open-Meteo tidak mengembalikan nama kota, jadi nama berupa penanda umum.
    location: {
      id: `${latitude},${longitude}`,
      name: "Lokasi terpilih",
      region: "",
      country: "",
      latitude,
      longitude,
    },
    current: parseCurrent(data.current),
    daily: parseDaily(data.daily),
  };
}

// Mengambil cuaca saat ini dan prakiraan 7 hari untuk satu titik.
// Input: latitude (-90..90) dan longitude (-180..180), sudah divalidasi pemanggil.
// Output: Promise berisi WeatherReport. Melempar Error (pesan Indonesia) bila
// Open-Meteo gagal, terlalu lama, atau bentuk datanya tidak sesuai.
export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherReport> {
  return loadWeatherReport(
    roundCoordinate(latitude),
    roundCoordinate(longitude),
  );
}

// Mencari lokasi di Open-Meteo dan memetakannya, dengan cache server
// sekitar 1 hari ("use cache"). Fungsi ini sengaja tidak diekspor;
// pakai searchLocations.
// Input: query (kata kunci, sudah di-trim dan huruf kecil).
// Output: Promise berisi daftar Location (kosong bila tidak ada hasil).
async function loadLocations(query: string): Promise<Location[]> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 86400, expire: 604800 });

  const params = new URLSearchParams({
    name: query,
    count: String(MAX_LOCATION_RESULTS),
    language: "id",
  });

  const data = await fetchJson(
    `${GEOCODING_URL}?${params.toString()}`,
    "pencarian lokasi",
  );
  if (!isRecord(data)) {
    throw new Error("Balasan pencarian lokasi tidak sesuai format.");
  }

  // Bila tidak ada hasil, Open-Meteo tidak menyertakan field "results".
  if (data.results === undefined) {
    return [];
  }
  if (!Array.isArray(data.results)) {
    throw new Error("Balasan pencarian lokasi tidak sesuai format.");
  }

  const locations: Location[] = [];
  for (const item of data.results) {
    if (!isRecord(item)) continue;

    const { name, latitude, longitude } = item;
    if (
      typeof name !== "string" ||
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      typeof longitude !== "number" ||
      !Number.isFinite(longitude)
    ) {
      continue; // lewati hasil yang bentuknya tidak lengkap
    }

    locations.push({
      id:
        typeof item.id === "number"
          ? String(item.id)
          : `${latitude},${longitude}`,
      name,
      region: typeof item.admin1 === "string" ? item.admin1 : "",
      country: typeof item.country === "string" ? item.country : "",
      latitude,
      longitude,
    });
  }
  return locations;
}

// Mencari kota berdasarkan kata kunci.
// Input: query (teks pencarian, contoh: "solo").
// Output: Promise berisi daftar Location (maksimal 5; array kosong bila tidak
// ada hasil). Melempar Error (pesan Indonesia) bila layanan gagal.
export async function searchLocations(query: string): Promise<Location[]> {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") {
    return [];
  }
  return loadLocations(normalized);
}