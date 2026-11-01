# AgriTech Hub - SPEC

## Tujuan
Website edukasi teknologi pertanian: artikel, glosarium, dan alat bantu hitung/data cuaca.
Pengguna: mahasiswa, petani muda, pelaku agribisnis.

## MVP (target 6-8 minggu)
1. Beranda: pengenalan, artikel terbaru, kategori.
2. Artikel: daftar, filter kategori (IoT pertanian, hidroponik, drone, smart irrigation,
   precision farming, pascapanen), halaman detail.
3. Glosarium istilah pertanian dengan pencarian.
4. Cuaca: prakiraan untuk lokasi pilihan pengguna (API eksternal).
5. Satu kalkulator: kebutuhan pupuk per luas lahan (atau nutrisi hidroponik).
6. Login admin (hanya kamu) untuk menulis/mengedit artikel.

## Nanti (setelah MVP)
Komentar, simpan favorit, dashboard sensor IoT simulasi, unggah gambar,
multi-bahasa, newsletter.

## Halaman
/ , /artikel , /artikel/[slug] , /glosarium , /cuaca , /alat/pupuk , /admin

## Entitas data
- articles: id, title, slug, content, category_id, cover_url, published, created_at
- categories: id, name, slug
- glossary: id, term, definition, related_category_id
- fertilizer_presets: id, crop, n_kg_ha, p_kg_ha, k_kg_ha, source_note
- profiles: id (user), role (admin/user)

## API eksternal (gratis)
- Open-Meteo: cuaca dan prakiraan (tanpa API key)
- BMKG Open Data: prakiraan cuaca Indonesia (cek dokumentasi terbaru)

## Stack
Next.js + TypeScript + Tailwind, Supabase (DB + Auth), Vercel.