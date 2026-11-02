// Mengambil huruf awal sebuah teks sebagai huruf besar A-Z.
// Huruf beraksen (contoh "É") diubah ke huruf dasarnya ("E").
// Input: text (teks apa saja, contoh: "pH" atau "Évaporasi").
// Output: satu huruf "A" sampai "Z", atau "#" jika awalnya bukan huruf A-Z.
export function getInitialLetter(text: string): string {
  const first = text.trim().normalize("NFD").charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first) ? first : "#";
}