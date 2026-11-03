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

// Mengubah tanggal "YYYY-MM-DD" menjadi nama hari + tanggal, contoh:
// "Selasa, 3 November". Memakai zona waktu UTC supaya tanggal tidak bergeser.
// Input: isoDate (string tanggal, contoh: "2026-11-03").
// Output: string tanggal Indonesia. Bila format salah, mengembalikan teks aslinya.
export function formatForecastDay(isoDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return isoDate;
  }

  try {
    const date = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  } catch {
    return isoDate;
  }
}

// Mengambil jam dan menit dari waktu setempat dengan memotong teks
// (tidak memakai new Date, jadi tidak terpengaruh zona waktu perangkat).
// Input: isoLocalTime (string "YYYY-MM-DDTHH:mm", contoh: "2026-11-03T14:00").
// Output: string "HH:mm", contoh: "14:00". Bila format salah, mengembalikan teks aslinya.
export function formatLocalTime(isoLocalTime: string): string {
  const match = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/.exec(isoLocalTime);
  return match ? match[1] : isoLocalTime;
}