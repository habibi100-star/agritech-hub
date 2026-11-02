import type { Article, Category } from "@/types";

// Data palsu kategori untuk tahap tampilan.
export const categories: Category[] = [
  { id: "kat-1", name: "IoT Pertanian", slug: "iot-pertanian" },
  { id: "kat-2", name: "Hidroponik", slug: "hidroponik" },
  { id: "kat-3", name: "Smart Irrigation", slug: "smart-irrigation" },
];

// Data palsu artikel untuk tahap tampilan (8 artikel terbit).
// coverUrl dikosongkan karena sampul sementara memakai kotak placeholder.
// content ditulis sebagai daftar paragraf lalu digabung dengan baris kosong.
export const articles: Article[] = [
  {
    id: "art-1",
    title: "Sensor Kelembapan Tanah: Cara Kerja dan Cara Memilihnya",
    slug: "sensor-kelembapan-tanah",
    excerpt:
      "Sensor kelembapan tanah membantu petani mengetahui kapan tanaman benar-benar butuh air. Pelajari jenis kapasitif dan resistif, beserta kelebihan dan kekurangannya untuk lahan kecil.",
    content: [
      "Sensor kelembapan tanah adalah alat yang membaca seberapa basah tanah di sekitar akar tanaman. Hasil bacaannya membantu petani memutuskan kapan penyiraman benar-benar diperlukan, bukan hanya berdasarkan kebiasaan atau perkiraan.",
      "Secara umum ada dua jenis yang sering dijumpai. Sensor resistif mengukur seberapa mudah arus listrik mengalir di antara dua logam yang ditancapkan ke tanah. Sensor kapasitif mengukur perubahan sifat listrik tanah tanpa membiarkan logamnya bersentuhan langsung dengan air.",
      "Sensor resistif biasanya lebih murah, tetapi logamnya cenderung berkarat dan bacaannya bisa bergeser seiring waktu. Sensor kapasitif umumnya lebih awet dan lebih stabil, walaupun harganya sedikit lebih tinggi dan perlu dikalibrasi agar sesuai dengan jenis tanah yang dipakai.",
      "Untuk lahan kecil, mulailah dengan satu atau dua sensor di titik yang mewakili kebun. Catat bacaannya selama beberapa hari dan bandingkan dengan kondisi tanah yang kamu lihat dan rasakan langsung. Dari situ kamu bisa menentukan sendiri batas basah dan kering yang cocok untuk tanamanmu.",
    ].join("\n\n"),
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
    content: [
      "NFT atau Nutrient Film Technique adalah sistem hidroponik yang mengalirkan lapisan tipis larutan nutrisi melewati akar tanaman secara terus-menerus. Akar mendapat nutrisi dan udara pada saat bersamaan, sehingga tanaman bisa tumbuh tanpa tanah.",
      "Peralatan dasarnya meliputi talang atau pipa tempat tanaman, wadah penampung larutan nutrisi, pompa kecil untuk mengalirkan larutan, dan selang penghubung. Talang dipasang dengan sedikit kemiringan agar larutan mengalir turun dan kembali ke wadah penampung.",
      "Karena hanya butuh ruang vertikal dan permukaan yang datar, sistem ini cocok untuk halaman rumah, teras, atau atap. Rangkaian bisa dibuat bertingkat untuk memperbanyak tanaman tanpa memakan banyak tempat.",
      "Bagi pemula, tanaman daun seperti selada, kangkung, dan pakcoy adalah pilihan yang aman karena tumbuh cepat dan tidak terlalu menuntut. Jaga kebersihan sistem dan pastikan pompa selalu berjalan, sebab akar yang dibiarkan kering akan cepat rusak.",
    ].join("\n\n"),
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
    content: [
      "Irigasi tetes menyalurkan air sedikit demi sedikit tepat di dekat akar tanaman lewat selang dan penetes. Cara ini jauh lebih hemat dibanding menyiram seluruh bedengan, karena air tidak terbuang ke area yang tidak dibutuhkan.",
      "Agar bekerja otomatis, sistem ini bisa dipadukan dengan timer yang membuka dan menutup keran pada jadwal tertentu. Tambahan sensor hujan akan menghentikan penyiraman ketika hujan turun, sehingga tanaman tidak kelebihan air.",
      "Komponen utamanya adalah sumber air atau pompa, filter agar penetes tidak tersumbat, selang utama, selang cabang, dan penetes. Timer dan sensor hujan dipasang di bagian awal jalur, sebelum air dibagi ke tanaman.",
      "Pada kebun cabai, penetes biasanya ditempatkan satu untuk tiap tanaman di dekat pangkal batang. Periksa penetes secara berkala karena kotoran kecil bisa menyumbatnya, dan sesuaikan jadwal penyiraman dengan fase pertumbuhan serta kondisi cuaca.",
    ].join("\n\n"),
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
    content: [
      "Greenhouse melindungi tanaman dari cuaca, tetapi suhu dan kelembapan di dalamnya bisa berubah dengan cepat. Jika terlalu panas atau terlalu lembap, tanaman mudah stres dan penyakit jamur lebih mudah muncul.",
      "Mikrokontroler adalah komputer kecil berharga murah yang bisa membaca data dari sensor. Dengan sensor suhu dan kelembapan, mikrokontroler dapat mengukur kondisi greenhouse secara rutin tanpa perlu dicek manual.",
      "Alur kerjanya sederhana. Sensor membaca kondisi udara, mikrokontroler mengolah datanya, lalu data dikirim lewat jaringan WiFi ke sebuah layanan atau aplikasi. Dari sana, data bisa ditampilkan sebagai grafik atau dikirim sebagai notifikasi ke ponsel ketika kondisinya keluar dari batas yang kamu tentukan.",
      "Mulailah dari pemantauan saja sebelum menambah kendali otomatis seperti kipas atau penyiram kabut. Dengan memahami pola harian greenhouse lebih dulu, kamu bisa memutuskan perangkat apa yang benar-benar dibutuhkan.",
    ].join("\n\n"),
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
    content: [
      "AB Mix adalah pupuk nutrisi hidroponik yang terdiri dari dua larutan pekat, yaitu A dan B. Keduanya dicampur dengan air untuk membuat larutan nutrisi yang menyediakan unsur hara bagi tanaman.",
      "EC (electrical conductivity) menunjukkan seberapa pekat nutrisi dalam larutan. Jika EC terlalu rendah, tanaman kekurangan makanan dan tumbuh lambat. Jika terlalu tinggi, akar sulit menyerap air dan daun bisa terlihat layu atau tepinya mengering.",
      "Kebutuhan nutrisi selada berubah sesuai fase tanam. Bibit muda membutuhkan larutan yang lebih encer, lalu kepekatannya dinaikkan bertahap seiring tanaman membesar. Ikuti anjuran pada kemasan produk yang kamu pakai sebagai acuan awal.",
      "Ukur EC secara rutin dengan alat EC meter dan catat hasilnya. Air dalam tandon akan berkurang karena diserap tanaman dan menguap, sehingga kepekatan larutan ikut berubah. Tambahkan air atau nutrisi sedikit demi sedikit, lalu ukur lagi sebelum menambah lebih jauh.",
    ].join("\n\n"),
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
    content: [
      "Menyiram tanaman tepat sebelum hujan turun hanya membuang air, tenaga, dan kadang listrik pompa. Di sisi lain, jadwal siram yang kaku bisa terlambat pada hari yang sangat panas dan kering.",
      "Penjadwalan berdasarkan cuaca berarti jadwal siram disesuaikan dengan prakiraan hujan, suhu, dan kelembapan. Jika hujan diperkirakan turun, penyiraman ditunda. Jika cuaca diperkirakan panas dan kering, penyiraman bisa dimajukan atau ditambah.",
      "Prakiraan cuaca dapat dilihat dari aplikasi atau situs resmi seperti BMKG. Datanya lalu dipadukan dengan pengamatan langsung di kebun, misalnya kondisi tanah dan daun, karena keadaan di lahanmu sering berbeda dari prakiraan yang bersifat umum.",
      "Dengan kebiasaan ini, air yang dipakai lebih hemat dan tanaman terhindar dari kekeringan maupun kelebihan air. Untuk sistem otomatis, jadwal bisa dihubungkan dengan data cuaca agar penyesuaiannya berjalan sendiri.",
    ].join("\n\n"),
    categoryId: "kat-3",
    coverUrl: "",
    published: true,
    createdAt: "2026-10-02",
  },
  {
    id: "art-7",
    title: "Mengenal LoRa: Jaringan Hemat Daya untuk Sensor di Lahan Luas",
    slug: "jaringan-lora-sensor-lahan-luas",
    excerpt:
      "Di lahan luas, sinyal WiFi sering tidak sampai. Kenali LoRa, teknologi komunikasi jarak jauh berdaya rendah yang cocok untuk menghubungkan sensor di kebun dan sawah.",
    content: [
      "Di lahan yang luas, sinyal WiFi biasanya hanya menjangkau area sekitar rumah atau gudang. Sensor yang dipasang jauh di tengah kebun atau sawah sering tidak bisa mengirim data karena tidak ada jaringan yang sampai ke sana.",
      "LoRa adalah teknologi komunikasi radio yang dirancang untuk jarak jauh dengan konsumsi daya sangat rendah. Sensor cukup mengirim data berukuran kecil, seperti nilai kelembapan tanah, sehingga baterainya bisa bertahan lama.",
      "Biasanya ada satu perangkat penghubung yang disebut gateway. Sensor-sensor mengirim data ke gateway lewat LoRa, lalu gateway meneruskannya ke internet. Dengan begitu, banyak sensor di titik yang berbeda cukup memakai satu gateway.",
      "Kekurangannya, LoRa tidak cocok untuk mengirim data besar seperti foto atau video karena kecepatannya rendah. Karena itu LoRa paling pas untuk data ringan yang dikirim berkala. Pastikan juga perangkat yang kamu pakai sesuai aturan frekuensi yang berlaku di Indonesia.",
    ].join("\n\n"),
    categoryId: "kat-1",
    coverUrl: "",
    published: true,
    createdAt: "2026-09-25",
  },
  {
    id: "art-8",
    title: "Hidroponik Sistem Sumbu: Cara Paling Sederhana untuk Pemula",
    slug: "hidroponik-sistem-sumbu-pemula",
    excerpt:
      "Sistem sumbu atau wick adalah cara hidroponik paling sederhana karena tanpa pompa dan listrik. Cocok untuk belajar sebelum beralih ke sistem yang lebih rumit.",
    content: [
      "Hidroponik sistem sumbu, atau wick, adalah cara bercocok tanam tanpa tanah yang paling sederhana. Tidak ada pompa dan tidak butuh listrik, sehingga cocok untuk mencoba hidroponik pertama kali.",
      "Prinsipnya mirip sumbu kompor. Sumbu dari bahan seperti kain atau tali menyerap larutan nutrisi dari wadah di bawah, lalu menaikkannya ke media tanam tempat akar berada. Air dan nutrisi naik secara alami lewat serat sumbu.",
      "Bahan yang dibutuhkan mudah dicari: wadah bekas, pot kecil atau gelas, media tanam seperti sekam bakar atau cocopeat, sumbu, dan larutan nutrisi. Tanaman ditempatkan di media, sedangkan ujung sumbu terendam di larutan.",
      "Kelemahannya, sistem ini kurang cocok untuk tanaman yang banyak minum atau butuh banyak nutrisi karena pasokan lewat sumbu terbatas. Tanaman kecil seperti selada atau herba lebih sesuai. Periksa wadah secara berkala agar larutan tidak habis atau berlumut.",
    ].join("\n\n"),
    categoryId: "kat-2",
    coverUrl: "",
    published: true,
    createdAt: "2026-09-18",
  },
];