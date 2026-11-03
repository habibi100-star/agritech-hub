"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import DailyForecastList from "@/components/DailyForecastList";
import type {
  CurrentWeather,
  DailyForecast,
  Location,
  WeatherReport,
} from "@/types";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 60;
const MAX_SEARCH_RESULTS = 5;

const GENERIC_WEATHER_ERROR =
  "Data cuaca tidak bisa dimuat saat ini. Silakan coba lagi.";
const GENERIC_SEARCH_ERROR =
  "Pencarian kota tidak bisa dilakukan saat ini. Silakan coba lagi.";
const NETWORK_ERROR =
  "Tidak bisa terhubung ke server. Periksa koneksi internetmu, lalu coba lagi.";

// Tipe kecil untuk state UI (bukan tipe domain).
// Hasil cuaca disimpan bersama kunci permintaannya, supaya "sedang memuat"
// bisa diturunkan dari perbedaan kunci hasil dengan kunci lokasi aktif.
type WeatherResult =
  | { key: string; status: "success"; report: WeatherReport }
  | { key: string; status: "error"; message: string };

// Status pencarian kota.
type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "results"; query: string; items: Location[] }
  | { status: "empty"; query: string }
  | { status: "error"; query: string; message: string };

const baseFilterStyle =
  "inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors";

// Memilih kelas gaya untuk tombol kota (chip).
// Input: isActive (true jika kota sedang dipilih).
// Output: string kelas Tailwind.
function getFilterClass(isActive: boolean): string {
  return isActive
    ? `${baseFilterStyle} border-primary bg-primary text-white`
    : `${baseFilterStyle} border-border bg-surface text-text hover:border-primary hover:text-primary`;
}

// Memeriksa apakah nilai adalah objek biasa.
// Input: value (nilai apa saja).
// Output: true bila objek biasa (bukan null atau array).
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Memeriksa apakah nilai adalah angka yang valid.
// Input: value (nilai apa saja).
// Output: true bila angka terbatas (bukan NaN atau Infinity).
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// Memeriksa bentuk data CurrentWeather.
// Input: value (data dari server).
// Output: true bila semua field yang dipakai tampilan ada dan bertipe benar.
function isCurrentWeather(value: unknown): value is CurrentWeather {
  return (
    isRecord(value) &&
    isFiniteNumber(value.temperatureC) &&
    isFiniteNumber(value.apparentTemperatureC) &&
    isFiniteNumber(value.humidityPercent) &&
    isFiniteNumber(value.precipitationMm) &&
    isFiniteNumber(value.windSpeedKmh) &&
    isFiniteNumber(value.weatherCode) &&
    typeof value.time === "string"
  );
}

// Memeriksa bentuk data DailyForecast.
// Input: value (data dari server).
// Output: true bila semua field ada dan bertipe benar (peluang hujan boleh null).
function isDailyForecast(value: unknown): value is DailyForecast {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    isFiniteNumber(value.weatherCode) &&
    isFiniteNumber(value.tempMaxC) &&
    isFiniteNumber(value.tempMinC) &&
    isFiniteNumber(value.precipitationSumMm) &&
    (value.precipitationProbabilityPercent === null ||
      isFiniteNumber(value.precipitationProbabilityPercent))
  );
}

// Memeriksa bentuk data WeatherReport.
// Input: value (data dari /api/weather).
// Output: true bila cuaca saat ini valid dan prakiraan harian tidak kosong.
function isWeatherReport(value: unknown): value is WeatherReport {
  return (
    isRecord(value) &&
    isRecord(value.location) &&
    isCurrentWeather(value.current) &&
    Array.isArray(value.daily) &&
    value.daily.length > 0 &&
    value.daily.every(isDailyForecast)
  );
}

// Memeriksa bentuk satu Location.
// Input: value (data dari /api/geocode).
// Output: true bila field yang dipakai ada dan bertipe benar.
function isLocation(value: unknown): value is Location {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.region === "string" &&
    typeof value.country === "string" &&
    isFiniteNumber(value.latitude) &&
    isFiniteNumber(value.longitude)
  );
}

// Memeriksa bahwa nilai adalah daftar Location.
// Input: value (data dari /api/geocode).
// Output: true bila array dan semua isinya Location yang valid.
function isLocationList(value: unknown): value is Location[] {
  return Array.isArray(value) && value.every(isLocation);
}

// Memeriksa apakah error berasal dari pembatalan permintaan (AbortController).
// Input: error (nilai dari catch).
// Output: true bila AbortError.
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

// Membaca JSON dari respons dengan aman.
// Input: response (hasil fetch).
// Output: Promise berisi data JSON, atau null bila isinya bukan JSON valid.
async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Mengambil pesan error dari respons gagal.
// Input: response (respons dengan status gagal), fallback (pesan umum).
// Output: Promise berisi pesan dari { error } bila ada, jika tidak pesan umum.
async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const data = await readJson(response);
  if (isRecord(data) && typeof data.error === "string" && data.error.trim() !== "") {
    return data.error;
  }
  return fallback;
}

// Memeriksa kata kunci pencarian sebelum memanggil API.
// Input: query (kata kunci yang sudah di-trim).
// Output: pesan error (Indonesia), atau null bila kata kunci valid.
function validateQuery(query: string): string | null {
  if (query.length < MIN_QUERY_LENGTH) {
    return `Ketik minimal ${MIN_QUERY_LENGTH} karakter nama kota.`;
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return `Nama kota terlalu panjang. Maksimal ${MAX_QUERY_LENGTH} karakter.`;
  }
  return null;
}

// Menyusun teks lokasi dari bagian yang tidak kosong.
// Input: location (lokasi).
// Output: teks, contoh: "Bandung, Jawa Barat, Indonesia".
function formatLocationLabel(location: Location): string {
  return [location.name, location.region, location.country]
    .filter((part) => part.trim() !== "")
    .join(", ");
}

// Komponen utama halaman cuaca: pemilih lokasi (preset + pencarian),
// pengambilan data cuaca, dan tampilan memuat/galat/berhasil.
// Input: locations (kota preset; elemen pertama adalah lokasi bawaan).
// Output: seluruh bagian interaktif halaman /cuaca.
export default function WeatherExplorer({
  locations,
}: {
  locations: Location[];
}) {
  const [activeLocation, setActiveLocation] = useState<Location | null>(
    locations[0] ?? null,
  );
  const [result, setResult] = useState<WeatherResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const searchControllerRef = useRef<AbortController | null>(null);

  // Kunci permintaan = koordinat + nomor percobaan. Bila kunci hasil
  // berbeda dari kunci ini, berarti data yang tampil sudah usang (sedang memuat).
  const latitude = activeLocation?.latitude ?? null;
  const longitude = activeLocation?.longitude ?? null;
  const requestKey =
    latitude !== null && longitude !== null
      ? `${latitude},${longitude}#${attempt}`
      : null;

  useEffect(() => {
    if (latitude === null || longitude === null || requestKey === null) {
      return;
    }

    const controller = new AbortController();

    // Mengambil cuaca lalu menyimpan hasilnya bersama kuncinya.
    // Input: key (kunci permintaan), lat dan lon (koordinat).
    // Output: tidak ada (mengisi state result; jawaban yang dibatalkan diabaikan).
    async function loadWeather(key: string, lat: number, lon: number) {
      try {
        const response = await fetch(
          `/api/weather?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          const message = await readErrorMessage(response, GENERIC_WEATHER_ERROR);
          setResult({ key, status: "error", message });
          return;
        }

        const data = await readJson(response);
        if (!isWeatherReport(data)) {
          setResult({ key, status: "error", message: GENERIC_WEATHER_ERROR });
          return;
        }

        setResult({ key, status: "success", report: data });
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        setResult({ key, status: "error", message: NETWORK_ERROR });
      }
    }

    void loadWeather(requestKey, latitude, longitude);

    return () => controller.abort();
  }, [latitude, longitude, requestKey]);

  // Mencari kota lewat /api/geocode lalu menyimpan statusnya.
  // Input: query (kata kunci yang sudah valid dan di-trim).
  // Output: Promise tanpa nilai (mengisi state search).
  async function runSearch(query: string) {
    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;

    setSearch({ status: "loading" });

    try {
      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(query)}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        const message = await readErrorMessage(response, GENERIC_SEARCH_ERROR);
        setSearch({ status: "error", query, message });
        return;
      }

      const data = await readJson(response);
      if (!isLocationList(data)) {
        setSearch({ status: "error", query, message: GENERIC_SEARCH_ERROR });
        return;
      }

      setSearch(
        data.length === 0
          ? { status: "empty", query }
          : { status: "results", query, items: data.slice(0, MAX_SEARCH_RESULTS) },
      );
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
      setSearch({ status: "error", query, message: NETWORK_ERROR });
    }
  }

  // Menangani pengiriman form pencarian (Enter atau tombol "Cari").
  // Input: event (event submit form).
  // Output: tidak ada (menampilkan pesan validasi, atau memulai pencarian).
  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchInput.trim();
    const message = validateQuery(query);

    if (message !== null) {
      setInputError(message);
      return;
    }

    setInputError(null);
    void runSearch(query);
  }

  // Memilih lokasi (dari preset atau hasil pencarian) sebagai lokasi aktif.
  // Input: location (lokasi yang dipilih).
  // Output: tidak ada (lokasi aktif berubah, daftar hasil pencarian ditutup).
  function selectLocation(location: Location) {
    setActiveLocation(location);
    setSearch({ status: "idle" });
    setSearchInput("");
    setInputError(null);
  }

  // Hasil yang kuncinya cocok dengan permintaan sekarang (null bila masih memuat).
  const currentResult =
    result !== null && result.key === requestKey ? result : null;

  const announcement =
    activeLocation !== null && currentResult?.status === "success"
      ? `Menampilkan cuaca untuk ${activeLocation.name}`
      : "";

  let weatherContent;
  if (activeLocation === null) {
    weatherContent = (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <h2 className="text-xl font-bold">Belum ada lokasi</h2>
        <p className="mx-auto mt-2 max-w-md text-text-muted">
          Cari nama kota pada kotak di atas untuk melihat cuaca dan prakiraannya.
        </p>
      </div>
    );
  } else if (currentResult === null) {
    weatherContent = (
      <div aria-busy="true">
        <p role="status" className="text-sm text-text-muted">
          Memuat data cuaca...
        </p>
        <div aria-hidden="true" className="mt-4 space-y-4">
          <div className="h-64 animate-pulse rounded-2xl bg-border" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-border" />
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-2xl bg-border"
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else if (currentResult.status === "error") {
    weatherContent = (
      <div
        role="alert"
        className="rounded-2xl border border-error bg-surface p-6"
      >
        <p className="font-bold text-error">Cuaca tidak bisa ditampilkan</p>
        <p className="mt-2 text-text">{currentResult.message}</p>
        <button
          type="button"
          onClick={() => setAttempt((value) => value + 1)}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-primary px-6 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Coba lagi
        </button>
      </div>
    );
  } else {
    weatherContent = (
      <div className="space-y-10">
        <CurrentWeatherCard
          location={activeLocation}
          current={currentResult.report.current}
        />
        <DailyForecastList
          daily={currentResult.report.daily}
          currentTime={currentResult.report.current.time}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Pembaca layar akan membacakan teks ini saat lokasi berganti */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <section aria-labelledby="judul-pilih-lokasi">
        <h2 id="judul-pilih-lokasi" className="text-2xl font-bold">
          Pilih lokasi
        </h2>

        {locations.length > 0 ? (
          <>
            <p
              id="label-kota-pilihan"
              className="mt-4 text-sm font-semibold text-primary-dark"
            >
              Kota pilihan
            </p>
            <div
              role="group"
              aria-labelledby="label-kota-pilihan"
              className="mt-2 flex flex-wrap gap-2"
            >
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  aria-pressed={activeLocation?.id === location.id}
                  onClick={() => selectLocation(location)}
                  className={getFilterClass(activeLocation?.id === location.id)}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <form
          role="search"
          aria-label="Cari kota"
          onSubmit={handleSubmit}
          noValidate
          className="mt-6"
        >
          <label
            htmlFor="cari-kota"
            className="block text-sm font-semibold text-primary-dark"
          >
            Cari kota lain
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="cari-kota"
              type="search"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setInputError(null);
              }}
              placeholder="Contoh: Solo"
              aria-invalid={inputError !== null}
              aria-describedby={inputError !== null ? "pesan-cari-kota" : undefined}
              className="h-12 w-full rounded-full border border-border bg-surface px-5 text-base text-text placeholder:text-text-muted sm:max-w-md"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Cari
            </button>
          </div>
          {inputError !== null ? (
            <p
              id="pesan-cari-kota"
              role="alert"
              className="mt-2 text-sm font-semibold text-error"
            >
              {inputError}
            </p>
          ) : null}
        </form>

        {/* Wilayah ini selalu ada, jadi perubahan isinya dibacakan pembaca layar */}
        <div role="status" aria-live="polite" className="mt-4">
          {search.status === "loading" ? (
            <p className="text-sm text-text-muted">Mencari...</p>
          ) : null}

          {search.status === "results" ? (
            <p className="text-sm text-text-muted">
              Ditemukan {search.items.length} lokasi untuk “{search.query}”.
              Pilih salah satu:
            </p>
          ) : null}

          {search.status === "empty" ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-8 text-center">
              <h3 className="text-lg font-bold">Kota tidak ditemukan</h3>
              <p className="mx-auto mt-2 max-w-md text-text-muted">
                Tidak ada hasil untuk “{search.query}”. Coba nama kota lain,
                periksa ejaannya, atau cari dengan nama yang lebih umum.
              </p>
            </div>
          ) : null}
        </div>

        {search.status === "results" ? (
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {search.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectLocation(item)}
                  className="flex min-h-11 w-full items-center rounded-2xl border border-border bg-surface px-4 py-2 text-left text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary"
                >
                  {formatLocationLabel(item)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {search.status === "error" ? (
          <div
            role="alert"
            className="mt-3 rounded-2xl border border-error bg-surface p-5"
          >
            <p className="text-text">{search.message}</p>
            <button
              type="button"
              onClick={() => void runSearch(search.query)}
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full border border-primary px-6 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Coba lagi
            </button>
          </div>
        ) : null}
      </section>

      {weatherContent}
    </div>
  );
}