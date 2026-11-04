import type { FertilizerPreset } from "@/types";

// Data preset kebutuhan hara tanaman untuk Kalkulator Pupuk (satuan: kg per hektare).
//
// CARA MENAMBAH ATAU MENGUBAH TANAMAN (khusus pemilik website):
// 1. Untuk menambah tanaman, salin satu blok { ... } lalu ganti isinya.
//    Pastikan "id" unik, huruf kecil, tanpa spasi (contoh: "kedelai").
// 2. Isi nKgHa, pKgHa, dan kKgHa dengan angka dari sumber resmi
//    (misalnya rekomendasi pemupukan dari lembaga pertanian pemerintah).
// 3. WAJIB isi sourceNote dengan sumber resminya (nama dokumen, penerbit, tahun).
//    Jangan isi angka tanpa sumber yang jelas.
// 4. Angka 0 di ketiga kolom berarti "belum diisi". Halaman akan menampilkan
//    "Data dosis ... belum diisi" dan tidak menghitung apa pun.
export const fertilizerPresets: FertilizerPreset[] = [
  {
    id: "padi",
    crop: "Padi",
    nKgHa: 0,
    pKgHa: 0,
    kKgHa: 0,
    sourceNote:
      "Belum diisi. Isi dengan angka dari sumber resmi sebelum halaman ini dipakai.",
  },
  {
    id: "jagung",
    crop: "Jagung",
    nKgHa: 0,
    pKgHa: 0,
    kKgHa: 0,
    sourceNote:
      "Belum diisi. Isi dengan angka dari sumber resmi sebelum halaman ini dipakai.",
  },
  {
    id: "cabai",
    crop: "Cabai",
    nKgHa: 0,
    pKgHa: 0,
    kKgHa: 0,
    sourceNote:
      "Belum diisi. Isi dengan angka dari sumber resmi sebelum halaman ini dipakai.",
  },
];