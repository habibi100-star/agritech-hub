"use client";

import { useState } from "react";
import {
  M2_PER_HECTARE,
  calculateNutrientNeeds,
  convertToHectares,
  formatKg,
  hasPresetData,
  parseAreaInput,
  validateAreaHectares,
  type AreaUnit,
} from "@/lib/fertilizer-utils";
import type { FertilizerPreset } from "@/types";

const INVALID_AREA_MESSAGE =
  "Luas lahan tidak valid. Isi angka positif, contoh: 0,5 atau 2.";

const GENERAL_NOTE =
  "Hasil ini adalah perkiraan awal berdasarkan tabel acuan, bukan rekomendasi pemupukan final. Kebutuhan sebenarnya dipengaruhi kondisi tanah, varietas, dan musim. Konsultasikan dengan penyuluh pertanian setempat.";

const baseFilterStyle =
  "inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors";

// Hasil pemeriksaan isian luas: luas valid (hektare dan m²), atau pesan error.
type AreaCheck = {
  error: string | null;
  areaHa: number | null;
  areaM2: number | null;
};

// Memilih kelas gaya untuk tombol satuan (chip).
// Input: isActive (true jika satuan sedang dipilih).
// Output: string kelas Tailwind.
function getFilterClass(isActive: boolean): string {
  return isActive
    ? `${baseFilterStyle} border-primary bg-primary text-white`
    : `${baseFilterStyle} border-border bg-surface text-text hover:border-primary hover:text-primary`;
}

// Memformat angka luas gaya Indonesia.
// Input: value (angka), maxDigits (maksimal angka desimal).
// Output: teks angka, contoh: 5000 -> "5.000".
function formatArea(value: number, maxDigits: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: maxDigits });
}

// Memeriksa isian luas lahan.
// Input: text (isian pengguna), unit (satuan terpilih).
// Output: AreaCheck. Bila teks kosong, error dan luas sama-sama null.
function checkArea(text: string, unit: AreaUnit): AreaCheck {
  if (text.trim() === "") {
    return { error: null, areaHa: null, areaM2: null };
  }

  const parsed = parseAreaInput(text);
  if (parsed === null) {
    return { error: INVALID_AREA_MESSAGE, areaHa: null, areaM2: null };
  }

  const areaHa = convertToHectares(parsed, unit);
  const error = validateAreaHectares(areaHa);
  if (error !== null) {
    return { error, areaHa: null, areaM2: null };
  }

  return { error: null, areaHa, areaM2: areaHa * M2_PER_HECTARE };
}

// Kalkulator kebutuhan hara per luas lahan. Hasil dihitung langsung dari
// state saat render (tanpa useEffect).
// Input: presets (daftar tanaman dari server).
// Output: formulir, area hasil, sumber angka, dan catatan umum.
export default function FertilizerCalculator({
  presets,
}: {
  presets: FertilizerPreset[];
}) {
  const [cropId, setCropId] = useState(presets[0]?.id ?? "");
  const [areaText, setAreaText] = useState("");
  const [unit, setUnit] = useState<AreaUnit>("ha");

  // Mengembalikan semua isian ke keadaan awal.
  // Input: tidak ada.
  // Output: tidak ada.
  function resetForm() {
    setCropId(presets[0]?.id ?? "");
    setAreaText("");
    setUnit("ha");
  }

  if (presets.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
        <h2 className="text-xl font-bold">Belum ada data tanaman</h2>
        <p className="mx-auto mt-2 max-w-md text-text-muted">
          Belum ada data tanaman.
        </p>
      </div>
    );
  }

  const selectedPreset =
    presets.find((preset) => preset.id === cropId) ?? null;
  const { error: areaError, areaHa, areaM2 } = checkArea(areaText, unit);
  const isAreaEmpty = areaText.trim() === "";

  let resultContent;
  if (isAreaEmpty) {
    resultContent = (
      <p className="text-text-muted">Isi luas lahan untuk melihat perkiraan.</p>
    );
  } else if (areaHa === null || areaM2 === null || selectedPreset === null) {
    // Luas tidak valid: tidak ada hasil (pesan ada di bawah kotak isian).
    resultContent = null;
  } else if (!hasPresetData(selectedPreset)) {
    resultContent = (
      <p className="rounded-2xl border border-border bg-surface p-5 text-text">
        Data dosis untuk {selectedPreset.crop} belum diisi.
      </p>
    );
  } else {
    const needs = calculateNutrientNeeds(selectedPreset, areaHa);
    const nutrients = [
      { label: "Nitrogen (N)", value: needs.nKg },
      { label: "Fosfor (P)", value: needs.pKg },
      { label: "Kalium (K)", value: needs.kKg },
    ];

    resultContent = (
      <div>
        <p className="text-sm font-semibold text-primary-dark">
          Luas dihitung: {formatArea(areaHa, 4)} ha ({formatArea(areaM2, 2)} m²)
        </p>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {nutrients.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <dt className="text-sm text-text-muted">{item.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-primary-dark">
                {formatKg(item.value)} kg
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm text-text-muted">
          Dosis acuan: N {formatKg(selectedPreset.nKgHa)} / P{" "}
          {formatKg(selectedPreset.pKgHa)} / K {formatKg(selectedPreset.kKgHa)}{" "}
          kg per hektare
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section
        aria-labelledby="judul-isian"
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <h2 id="judul-isian" className="text-2xl font-bold">
          Data lahan
        </h2>

        <div className="mt-4">
          <label
            htmlFor="pilih-tanaman"
            className="block text-sm font-semibold text-primary-dark"
          >
            Tanaman
          </label>
          <select
            id="pilih-tanaman"
            value={cropId}
            onChange={(event) => setCropId(event.target.value)}
            className="mt-2 h-12 w-full rounded-full border border-border bg-surface px-5 text-base text-text sm:max-w-md"
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.crop}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label
            htmlFor="luas-lahan"
            className="block text-sm font-semibold text-primary-dark"
          >
            Luas lahan
          </label>
          <input
            id="luas-lahan"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={areaText}
            onChange={(event) => setAreaText(event.target.value)}
            placeholder="Contoh: 0,5"
            aria-invalid={areaError !== null}
            aria-describedby={
              areaError !== null ? "bantuan-luas pesan-luas" : "bantuan-luas"
            }
            className="mt-2 h-12 w-full rounded-full border border-border bg-surface px-5 text-base text-text placeholder:text-text-muted sm:max-w-md"
          />
          <p id="bantuan-luas" className="mt-2 text-sm text-text-muted">
            Gunakan koma atau titik untuk desimal, tanpa pemisah ribuan.
          </p>
          {areaError !== null ? (
            <p
              id="pesan-luas"
              role="alert"
              className="mt-2 text-sm font-semibold text-error"
            >
              {areaError}
            </p>
          ) : null}
        </div>

        <p
          id="label-satuan-luas"
          className="mt-6 text-sm font-semibold text-primary-dark"
        >
          Satuan luas
        </p>
        <div
          role="group"
          aria-labelledby="label-satuan-luas"
          className="mt-2 flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={unit === "m2"}
            onClick={() => setUnit("m2")}
            className={getFilterClass(unit === "m2")}
          >
            m²
          </button>
          <button
            type="button"
            aria-pressed={unit === "ha"}
            onClick={() => setUnit("ha")}
            className={getFilterClass(unit === "ha")}
          >
            hektare
          </button>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-primary px-6 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Atur ulang
        </button>
      </section>

      <section aria-labelledby="judul-hasil">
        <h2 id="judul-hasil" className="text-2xl font-bold">
          Perkiraan kebutuhan hara
        </h2>
        <div role="status" aria-live="polite" className="mt-4">
          {resultContent}
        </div>
      </section>

      {selectedPreset !== null ? (
        <section
          aria-labelledby="judul-sumber"
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <h2 id="judul-sumber" className="text-xl font-bold">
            Sumber angka
          </h2>
          <p className="mt-2 text-text-muted">
            <span className="font-semibold text-text">
              {selectedPreset.crop}:
            </span>{" "}
            {selectedPreset.sourceNote}
          </p>
        </section>
      ) : null}

      <section
        aria-labelledby="judul-catatan"
        className="rounded-2xl border border-border bg-background p-6"
      >
        <h2 id="judul-catatan" className="text-xl font-bold">
          Catatan
        </h2>
        <p className="mt-2 text-text-muted">{GENERAL_NOTE}</p>
      </section>
    </div>
  );
}