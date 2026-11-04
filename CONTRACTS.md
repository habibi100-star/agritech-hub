# Kontrak Data AgriTech Hub

## Tipe data (salinan dari types/index.ts)
Article:    id, title, slug, content, categoryId, coverUrl, published, createdAt
Category:   id, name, slug
GlossaryItem: id, term, definition, relatedCategoryId
FertilizerPreset: id, crop, nKgHa, pKgHa, kKgHa, sourceNote

## Tabel database (Supabase)
articles, categories, glossary, fertilizer_presets, profiles
(Skema SQL lengkap akan ditambahkan di sini setelah Tahap 4)

## Endpoint internal (rencana)
GET  /api/articles?category=&page=    -> daftar artikel published
GET  /api/articles/[slug]             -> detail satu artikel
GET  /api/glossary?q=                 -> cari istilah
GET  /api/weather?lat=&lon=           -> WeatherReport (lokasi hanya koordinat), 400 bila salah, 502 bila layanan gagal
GET  /api/geocode?q=                  -> Location[] (maks 5), q 2-60 karakter
GET  /api/fertilizer?crop=&area=      -> TIDAK DIPAKAI (diputuskan 2026-11-04): perhitungan dilakukan di client lewat lib/fertilizer-utils.ts; data preset dibaca server lewat getAllFertilizerPresets() di lib/api.ts

## Catatan
- Nama field di kode memakai camelCase, di database memakai snake_case
- Jika kontrak berubah, perbarui file ini dulu sebelum mengubah kode