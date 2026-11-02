"use client";

import { useState } from "react";
import { getInitialLetter } from "@/lib/glossary-utils";
import type { Category, GlossaryItem } from "@/types";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const baseFilterStyle =
  "inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors";

const baseLetterStyle =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold";

// Memilih kelas gaya untuk tombol filter kategori.
// Input: isActive (true jika filter sedang dipilih).
// Output: string kelas Tailwind.
function getFilterClass(isActive: boolean): string {
  return isActive
    ? `${baseFilterStyle} border-primary bg-primary text-white`
    : `${baseFilterStyle} border-border bg-surface text-text hover:border-primary hover:text-primary`;
}

// Membuat id bagian huruf untuk tautan anchor dan aria-labelledby.
// Input: letter (huruf "A" sampai "Z", atau "#").
// Output: string id, contoh: "huruf-A".
function getSectionId(letter: string): string {
  return letter === "#" ? "huruf-lainnya" : `huruf-${letter}`;
}

// Bagian interaktif halaman Glosarium: pencarian, filter kategori,
// navigasi huruf, jumlah hasil, daftar istilah per huruf, dan tampilan kosong.
// Input: items (semua istilah, sudah urut abjad), categories (semua kategori).
// Output: elemen pencarian, filter, navigasi huruf, dan daftar istilah.
export default function GlossaryExplorer({
  items,
  categories,
}: {
  items: GlossaryItem[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );
  const activeCategory =
    categories.find((category) => category.id === categoryId) ?? null;

  // Saring istilah menurut kategori dan kata kunci (di istilah atau definisi).
  const keyword = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchCategory = categoryId
      ? item.relatedCategoryId === categoryId
      : true;
    const matchKeyword =
      keyword === ""
        ? true
        : item.term.toLowerCase().includes(keyword) ||
          item.definition.toLowerCase().includes(keyword);
    return matchCategory && matchKeyword;
  });

  // Kelompokkan hasil per huruf awal (urutan abjad dari server tetap terjaga).
  const groups = new Map<string, GlossaryItem[]>();
  for (const item of filteredItems) {
    const letter = getInitialLetter(item.term);
    groups.set(letter, [...(groups.get(letter) ?? []), item]);
  }
  const orderedLetters = [...LETTERS, "#"].filter((letter) =>
    groups.has(letter),
  );

  // Mengosongkan pencarian dan kembali ke semua kategori.
  // Input: tidak ada.
  // Output: tidak ada.
  function resetFilters() {
    setQuery("");
    setCategoryId(null);
  }

  const resultText =
    filteredItems.length === 0
      ? "Tidak ada istilah yang cocok."
      : `Menampilkan ${filteredItems.length} istilah${
          activeCategory ? ` dalam kategori ${activeCategory.name}` : ""
        }.`;

  return (
    <div>
      <div role="search" aria-label="Cari dan saring istilah">
        <label
          htmlFor="cari-istilah"
          className="block text-sm font-semibold text-primary-dark"
        >
          Cari istilah atau definisi
        </label>
        <input
          id="cari-istilah"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Contoh: sensor"
          className="mt-2 h-12 w-full rounded-full border border-border bg-surface px-5 text-base text-text placeholder:text-text-muted sm:max-w-md"
        />

        <p
          id="label-kategori-glosarium"
          className="mt-6 text-sm font-semibold text-primary-dark"
        >
          Kategori
        </p>
        <div
          role="group"
          aria-labelledby="label-kategori-glosarium"
          className="mt-2 flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={categoryId === null}
            onClick={() => setCategoryId(null)}
            className={getFilterClass(categoryId === null)}
          >
            Semua
          </button>
          {categories.map((category) => {
            const isActive = categoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setCategoryId(category.id)}
                className={getFilterClass(isActive)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigasi huruf: bisa di-scroll ke samping di dalam kontainernya sendiri */}
      <nav aria-label="Navigasi huruf glosarium" className="mt-6">
        <ul className="flex gap-2 overflow-x-auto p-1">
          {LETTERS.map((letter) =>
            groups.has(letter) ? (
              <li key={letter} className="shrink-0">
                <a
                  href={`#${getSectionId(letter)}`}
                  aria-label={`Lompat ke huruf ${letter}`}
                  className={`${baseLetterStyle} border-primary bg-surface text-primary-dark hover:bg-primary hover:text-white`}
                >
                  {letter}
                </a>
              </li>
            ) : (
              <li key={letter} className="shrink-0">
                <span
                  className={`${baseLetterStyle} border-dashed border-border bg-background text-text-muted`}
                >
                  {letter}
                  <span className="sr-only"> (tidak ada istilah)</span>
                </span>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Pembaca layar akan membacakan teks ini setiap kali hasil berubah */}
      <p
        role="status"
        aria-live="polite"
        className="mt-6 text-sm text-text-muted"
      >
        {resultText}
      </p>

      {filteredItems.length > 0 ? (
        <div className="mt-4 space-y-10">
          {orderedLetters.map((letter) => {
            const sectionId = getSectionId(letter);
            return (
              <section key={letter} aria-labelledby={sectionId}>
                <h2
                  id={sectionId}
                  className="scroll-mt-24 border-b border-border pb-2 text-2xl font-bold"
                >
                  {letter === "#" ? "Lainnya" : letter}
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(groups.get(letter) ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border bg-surface p-5"
                    >
                      <dt className="text-lg font-bold text-primary-dark">
                        {item.term}
                      </dt>
                      <dd className="mt-2 text-text">{item.definition}</dd>
                      <dd className="mt-3">
                        <span className="inline-block rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-primary-dark">
                          {categoryNames.get(item.relatedCategoryId) ?? "Umum"}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <h2 className="text-xl font-bold">Istilah tidak ditemukan</h2>
          <p className="mx-auto mt-2 max-w-md text-text-muted">
            Coba kata kunci lain atau pilih kategori yang berbeda.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Atur ulang filter
          </button>
        </div>
      )}
    </div>
  );
}