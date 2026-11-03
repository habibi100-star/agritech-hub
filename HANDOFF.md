Saya mahasiswa semester 3 Teknologi Pertanian, pemula menengah dalam
koding, memakai Windows 11 dan VS Code (terminal PowerShell). Saya
membangun website edukasi "AgriTech Hub" dengan resource gratis. Peran
kamu: pembuat prompt untuk AI lain. Alurnya: kamu menulis prompt, saya
menempelkannya ke akun AI lain, mereka menulis kode, saya menempel kodenya
ke proyek lalu melapor ke kamu. Kamu juga membantu membaca error dan
memeriksa hasil. Jelaskan dengan bahasa sederhana untuk pemula, berikan
perintah PowerShell yang persis, dan kerjakan satu tahap pada satu waktu.

## Stack
Next.js 16.4.3 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4,
Cache Components aktif. Rencana: Supabase (DB + Auth), deploy ke Vercel.
Repo GitHub: habibi100-star/agritech-hub (branch main). Proyek ada di
D:\Latihan bikin WEB\agritech-hub. Tidak boleh menambah library tanpa izin.

## Dokumen di root proyek
SPEC.md, CONVENTIONS.md, CONTRACTS.md (aturan, kontrak data, daftar
endpoint). HANDOFF.md berisi ringkasan ini.

## Yang sudah selesai (semua di-commit dan di-push, lolos lint dan build)
1. Setup proyek + desain: palet hijau natural (token Tailwind di
   globals.css: primary #2F7D4F, primary-dark #14452F, accent #E8B931,
   background #FAF8F2, dll.), font Fraunces (judul) dan Inter (isi).
2. Beranda: Navbar, hero, kategori unggulan, 6 artikel terbaru, blok
   ajakan kalkulator (tautan /alat/pupuk), Footer.
3. /artikel (filter ?kategori=, pencarian, grid) dan /artikel/[slug]
   (detail, breadcrumb, artikel terkait, not-found, generateStaticParams).
4. /glosarium (20 istilah, pencarian, filter kategori, navigasi A-Z).
5. Lapisan data cuaca (Bagian 1): lib/weather.ts (hanya server),
   lib/weather-codes.ts (describeWeatherCode, aman diimpor client),
   data/locations.ts (6 kota preset, Yogyakarta bawaan), tipe cuaca di
   types/index.ts (Location, CurrentWeather, DailyForecast,
   WeatherReport, ApiError), route GET /api/weather?lat=&lon=
   (400 bila salah, 502 bila layanan gagal) dan GET /api/geocode?q=
   (q 2-60 karakter, maks 5 hasil). Sumber data: Open-Meteo (gratis,
   tanpa API key, non-komersial). Caching memakai "use cache" +
   cacheLife dan header Cache-Control.
   CATATAN: WeatherReport.location.name hanya berisi "Lokasi terpilih".
   Nama kota yang tampil di UI harus diambil dari lokasi yang dipilih
   pengguna (preset atau hasil geocode) di komponen client.

## Struktur folder (semua di root, bukan di public/)
app/ (page.tsx, layout.tsx, globals.css, artikel/, glosarium/,
api/weather/route.ts, api/geocode/route.ts), components/ (Navbar,
Footer, ArticleCard, CategoryCard, Button, SectionHeading, Breadcrumb,
ArticleExplorer, GlossaryExplorer), data/ (dummy.ts, locations.ts),
lib/ (api.ts, format.ts, glossary-utils.ts, weather.ts,
weather-codes.ts), types/index.ts. Artikel dan glosarium masih data
palsu dari dummy.ts lewat lib/api.ts.

## Aturan teknis yang sudah terbukti penting
- Cache Components: jangan pakai API dinamis (cookies, headers, fetch
  tanpa cache, waktu saat ini) di komponen server; searchParams dibaca
  di komponen client dan dibungkus <Suspense>; halaman dinamis wajib
  generateStaticParams; params berupa Promise.
- Komponen client tidak boleh mengimpor lib/api.ts, data/dummy.ts, atau
  lib/weather.ts (data ikut terkirim ke browser); pakai file utilitas
  terpisah seperti lib/glossary-utils.ts dan lib/weather-codes.ts.
  Komponen client mengambil cuaca lewat /api/weather dan /api/geocode.
- Pengecualian aturan CONVENTIONS.md: fungsi cuaca ada di
  lib/weather.ts, bukan lib/api.ts.
- Tipe data hanya dari types/index.ts. Tanpa hex di komponen.
- Folder dan file baru dibuat lewat terminal dari root proyek, karena
  pernah tersasar masuk ke public/.
- Kalau npm run dev memberi pesan "Another next dev server is already
  running", pakai server yang sudah ada di localhost:3000.
- Konten teknis (angka, dosis, definisi) saya verifikasi dan beri sumber
  sendiri; AI hanya boleh menulis konsep umum.

## Format prompt yang saya pakai untuk AI lain
Prompt lengkap berisi: peran, proyek, stack + aturan teknis, daftar file
yang saya tempel (CONVENTIONS.md, package.json, file terkait), tugas per
bagian, persyaratan kualitas (responsif mobile dulu, aksesibel, bahasa
Indonesia, komentar fungsi, tanpa library baru), dan format jawaban
wajib: (1) daftar file dibuat/diubah, (2) isi LENGKAP tiap file tanpa
dipotong, (3) penjelasan untuk pemula, (4) cara memeriksa di
localhost:3000, (5) daftar asumsi. Satu prompt untuk satu halaman.
Setelah kode jadi, urutan saya: tempel, uji di browser, npm run lint,
npm run build, lalu git add ., git commit -m "...", git push.

## Tahap berikutnya (urutan)
1. Halaman /cuaca (Bagian 2, tampilan saja): pemilih lokasi (preset +
   pencarian kota), kartu cuaca saat ini, prakiraan 7 hari, kondisi
   loading/error/kosong, catatan sumber Open-Meteo dan BMKG.
2. Kalkulator pupuk /alat/pupuk (data preset dengan sumber resmi).
3. Database Supabase: skema + RLS, ganti data palsu.
4. Login admin dan penulisan artikel.
5. Tes, keamanan, deploy ke Vercel.

## Hal yang masih perlu saya periksa sendiri
- Koordinat 6 kota di data/locations.ts (hanya Medan yang positif).
- Suhu dari /api/weather dibandingkan dengan aplikasi cuaca di ponsel.
- Syarat lisensi dan atribusi Open-Meteo sebelum website dipublikasikan
  (gratis hanya untuk non-komersial).
- Isi artikel dan glosarium dari AI harus saya tulis ulang atau beri
  sumber.