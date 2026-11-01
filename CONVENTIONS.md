# Aturan Proyek AgriTech Hub

## Stack
- Next.js (App Router), TypeScript strict, Tailwind CSS
- Supabase (database + auth), deploy ke Vercel
- Jangan menambah library baru tanpa izin saya

## Struktur folder
- app/          -> halaman dan route API
- components/   -> komponen UI yang dipakai ulang
- lib/          -> helper dan klien Supabase
- data/         -> data palsu (dummy) untuk tahap tampilan
- types/        -> tipe data bersama (types/index.ts)

## Penamaan
- Komponen: PascalCase (ArticleCard.tsx)
- File lain: kebab-case (fetch-weather.ts)
- Fungsi dan variabel: camelCase

## Aturan kode
- Semua tipe data diimpor dari types/index.ts, jangan buat tipe sendiri
- Akses data lewat fungsi di lib/api.ts, bukan langsung di komponen
- Setiap fungsi diberi komentar singkat: input dan output
- Error ditangani dengan try/catch, pesan untuk pengguna dalam bahasa Indonesia
- Semua halaman harus responsif (mobile dulu)
- Jelaskan kode dengan bahasa sederhana, karena saya pemula