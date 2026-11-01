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
GET  /api/weather?lat=&lon=           -> prakiraan cuaca (proxy Open-Meteo)
GET  /api/fertilizer?crop=&area=      -> hasil hitung kebutuhan pupuk

## Catatan
- Nama field di kode memakai camelCase, di database memakai snake_case
- Jika kontrak berubah, perbarui file ini dulu sebelum mengubah kode