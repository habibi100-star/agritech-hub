import type { Article, Category } from "@/types";

// Data palsu kategori untuk tahap tampilan.
export const categories: Category[] = [
  { id: "kat-1", name: "IoT Pertanian", slug: "iot-pertanian" },
  { id: "kat-2", name: "Hidroponik", slug: "hidroponik" },
  { id: "kat-3", name: "Smart Irrigation", slug: "smart-irrigation" },
];

// Data palsu artikel untuk tahap tampilan.
// coverUrl dikosongkan karena sampul sementara memakai kotak placeholder.
export const articles: Article[] = [
  {
    id: "art-1",
    title: "Sensor Kelembapan Tanah: Cara Kerja dan Cara Memilihnya",
    slug: "sensor-kelembapan-tanah",
    excerpt:
      "Sensor kelembapan tanah membantu petani mengetahui kapan tanaman benar-benar butuh air. Pelajari jenis kapasitif dan resistif, beserta kelebihan dan kekurangannya untuk lahan kecil.",
    categoryId: "kat-1",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-28",
  },
  {
    id: "art-2",
    title: "Memulai Hidroponik Sistem NFT di Lahan Sempit",
    slug: "hidroponik-nft-lahan-sempit",
    excerpt:
      "Sistem NFT (Nutrient Film Technique) cocok untuk halaman rumah atau atap. Berikut peralatan dasar, ukuran talang, dan tanaman daun yang paling mudah untuk pemula.",
    categoryId: "kat-2",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-24",
  },
  {
    id: "art-3",
    title: "Irigasi Tetes Otomatis dengan Timer dan Sensor Hujan",
    slug: "irigasi-tetes-otomatis",
    excerpt:
      "Irigasi tetes yang dipadukan dengan timer dan sensor hujan dapat menghemat air tanpa perlu menyiram manual. Kenali komponen utamanya dan cara menyusunnya di kebun cabai.",
    categoryId: "kat-3",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-20",
  },
  {
    id: "art-4",
    title: "Memantau Suhu dan Kelembapan Greenhouse dengan Mikrokontroler",
    slug: "monitoring-greenhouse-mikrokontroler",
    excerpt:
      "Dengan mikrokontroler murah dan sensor suhu, kondisi greenhouse bisa dipantau dari ponsel. Artikel ini membahas alur kerja sederhana dari sensor sampai notifikasi.",
    categoryId: "kat-1",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-15",
  },
  {
    id: "art-5",
    title: "Mengatur Nutrisi AB Mix dan Nilai EC pada Selada Hidroponik",
    slug: "nutrisi-ab-mix-ec-selada",
    excerpt:
      "Nilai EC yang terlalu tinggi atau rendah membuat selada tumbuh tidak optimal. Pahami cara mengukur EC dan takaran AB Mix yang aman pada tiap fase tanam.",
    categoryId: "kat-2",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-09",
  },
  {
    id: "art-6",
    title: "Menghemat Air dengan Penjadwalan Irigasi Berdasarkan Cuaca",
    slug: "penjadwalan-irigasi-berdasarkan-cuaca",
    excerpt:
      "Menyiram saat hujan akan datang hanya membuang air. Lihat cara menyesuaikan jadwal irigasi dengan prakiraan cuaca agar tanaman cukup air dan biaya lebih hemat.",
    categoryId: "kat-3",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-02",
  },
];