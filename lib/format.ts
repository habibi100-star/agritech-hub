// Jumlah kata yang dianggap terbaca per menit.
const WORDS_PER_MINUTE = 200;

// Mengubah tanggal ISO menjadi teks Indonesia, contoh: "28 Oktober 2026".
// Input: isoDate (string tanggal ISO).
// Output: string tanggal yang mudah dibaca.
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

// Memperkirakan lama membaca sebuah teks.
// Input: text (isi artikel).
// Output: angka menit, dibulatkan ke atas, minimal 1.
export function getReadingMinutes(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}