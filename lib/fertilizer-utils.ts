// Fungsi hitung murni untuk Kalkulator Pupuk. Tidak mengimpor data,
// jadi aman dipakai komponen client.
import type { FertilizerPreset } from "@/types";

// Satuan luas lahan: meter persegi atau hektare.
export type AreaUnit = "m2" | "ha";

// Jumlah meter persegi dalam 1 hektare.
export const M2_PER_HECTARE = 10000;

// Batas luas lahan yang diterima kalkulator (dalam hektare).
export const MAX_AREA_HECTARES = 10000;

// Pola angka: digit, boleh diikuti satu pemisah desimal (titik atau koma) + digit.
const AREA_PATTERN = /^\d+(?:[.,]\d+)?$/;

// Membulatkan angka ke 2 desimal.
// Input: value (angka). Output: angka yang dibulatkan.
function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Membaca teks luas lahan menjadi angka.
// Menerima titik atau koma sebagai pemisah desimal ("0,5" dan "0.5" sama).
// Menolak teks kosong, huruf, notasi ilmiah, minus, dan lebih dari satu pemisah.
// Pemisah ribuan tidak didukung.
// Input: text (teks dari kotak isian).
// Output: angka (0 atau lebih), atau null bila format tidak valid.
export function parseAreaInput(text: string): number | null {
  const trimmed = text.trim();
  if (!AREA_PATTERN.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

// Mengubah luas ke hektare.
// Input: area (angka luas), unit ("m2" atau "ha").
// Output: luas dalam hektare (1 ha = 10.000 m²).
export function convertToHectares(area: number, unit: AreaUnit): number {
  return unit === "m2" ? area / M2_PER_HECTARE : area;
}

// Memeriksa apakah luas (hektare) masuk batas yang diterima.
// Input: areaHa (luas dalam hektare).
// Output: pesan error bahasa Indonesia, atau null bila valid.
export function validateAreaHectares(areaHa: number): string | null {
  if (!Number.isFinite(areaHa) || areaHa <= 0) {
    return "Luas lahan harus lebih dari 0.";
  }
  if (areaHa > MAX_AREA_HECTARES) {
    return `Luas lahan terlalu besar. Maksimal ${MAX_AREA_HECTARES.toLocaleString("id-ID")} hektare.`;
  }
  return null;
}

// Menghitung kebutuhan hara untuk luas tertentu: kg per hektare x luas (ha).
// Input: preset (data tanaman), areaHa (luas dalam hektare).
// Output: objek { nKg, pKg, kKg }, masing-masing dibulatkan 2 desimal.
export function calculateNutrientNeeds(
  preset: FertilizerPreset,
  areaHa: number,
): { nKg: number; pKg: number; kKg: number } {
  return {
    nKg: roundToTwoDecimals(preset.nKgHa * areaHa),
    pKg: roundToTwoDecimals(preset.pKgHa * areaHa),
    kKg: roundToTwoDecimals(preset.kKgHa * areaHa),
  };
}

// Memeriksa apakah preset sudah berisi angka dosis.
// Input: preset (data tanaman).
// Output: false bila nKgHa, pKgHa, dan kKgHa semuanya 0; selain itu true.
export function hasPresetData(preset: FertilizerPreset): boolean {
  return !(preset.nKgHa === 0 && preset.pKgHa === 0 && preset.kKgHa === 0);
}

// Memformat angka kilogram gaya Indonesia, maksimal 2 desimal.
// Input: value (angka).
// Output: teks, contoh: 1250.5 -> "1.250,5".
export function formatKg(value: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}