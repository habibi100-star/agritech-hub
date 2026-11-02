Saya mahasiswa semester 3 Teknologi Pertanian, pemula menengah dalam
koding, memakai Windows 11 dan VS Code. Saya membangun website edukasi
"AgriTech Hub" dengan resource gratis. Peran kamu: pembuat prompt untuk AI
lain. Saya menempel prompt buatanmu ke akun AI lain, mereka menulis kode,
lalu saya menempelkan kodenya ke proyek dan melapor ke kamu. Kamu juga
membantu membaca error dan memeriksa hasil. Jelaskan dengan bahasa
sederhana untuk pemula, berikan perintah PowerShell yang persis, dan
satu tahap pada satu waktu.

## Stack
Next.js 16.4.3 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4,
Cache Components aktif. Rencana: Supabase (DB + Auth), Open-Meteo untuk
cuaca, deploy ke Vercel. Repo GitHub: habibi100-star/agritech-hub (branch
main). Proyek di D:\Latihan bikin WEB\agritech-hub. Tidak boleh menambah
library tanpa izin.

## Dokumen di root proyek
SPEC.md, CONVENTIONS.md, CONTRACTS.md (aturan, kontrak data, daftar
endpoint rencana).

## Yang sudah selesai (semua sudah di-commit dan di-push, lolos lint
dan build)
1. Setup proyek + desain: palet hijau natural (token Tailwind di
   globals.css: primary #2F7D4F, primary-dark #14452F, accent #E8B931,
   background #FAF8F2, dll.), font Fraunces (judul) dan Inter (isi).
2. Beranda: Navbar, hero, kategori unggulan, 6 artikel terbaru, blok
   ajakan kalkulator, Footer.
3. /artikel (filter kategori lewat ?kategori=, pencarian, grid) dan
   /artikel/[slug] (detail, breadcrumb, artikel terkait, not-found,
   generateStaticParams).
4. /glosarium (20 istilah, pencarian, filter kategori, navigasi A-Z).
   Sudah di-commit dan di-push, lolos lint dan build.

## Struktur folder (semua di root, bukan di public/)
app/ (page.tsx, layout.tsx, globals.css, artikel/, glosarium/),
components/ (Navbar, Footer, ArticleCard, CategoryCard, Button,
SectionHeading, Breadcrumb, ArticleExplorer, GlossaryExplorer),
data/dummy.ts, lib/ (api.ts, format.ts, glossary-utils.ts),
types/index.ts. Data masih palsu (dummy.ts) dan diakses lewat
fungsi di lib/api.ts.

## Aturan teknis yang sudah terbukti penting
- Cache Components: jangan pakai API dinamis (cookies, headers, fetch
  tanpa cache, waktu saat ini) di komponen server; searchParams
  dibaca di komponen client dan dibungkus <Suspense>; halaman dinamis
  wajib generateStaticParams; params berupa Promise.
- Komponen client tidak boleh mengimpor data dari lib/api.ts atau
  data/dummy.ts (data ikut terkirim ke browser); pakai file utilitas
  terpisah seperti lib/glossary-utils.ts.
- Tipe data hanya dari types/index.ts. Tanpa hex di komponen.
- Folder baru harus dibuat dari terminal di root, karena pernah
  tersasar masuk ke public/.
- Konten teknis (angka, dosis, definisi) harus saya verifikasi dan
  beri sumber sendiri; AI hanya boleh menulis konsep umum.

## Format prompt yang saya pakai untuk AI lain
Prompt lengkap berisi: peran, proyek, stack + aturan teknis, daftar file
yang saya tempel (CONVENTIONS.md, package.json, file terkait),
tugas per bagian, persyaratan kualitas (responsif mobile dulu,
aksesibel, bahasa Indonesia, komentar fungsi, tanpa library baru),
dan format jawaban wajib: (1) daftar file dibuat/diubah, (2) isi
LENGKAP tiap file tanpa dipotong, (3) penjelasan untuk pemula,
(4) cara memeriksa di localhost:3000, (5) daftar asumsi. Satu prompt
untuk satu halaman.

## Tahap berikutnya (urutan)
1. Halaman cuaca /cuaca (Open-Meteo, tanpa API key, lewat proxy
   internal /api/weather).
2. Kalkulator pupuk /alat/pupuk (data preset dengan sumber resmi).
3. Database Supabase: skema + RLS, ganti data palsu.
4. Login admin dan penulisan artikel.
5. Tes, keamanan, deploy ke Vercel.