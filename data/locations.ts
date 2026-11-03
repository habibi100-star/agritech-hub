import type { Location } from "@/types";

// Kota pilihan cepat untuk halaman cuaca. Elemen pertama (Yogyakarta)
// adalah lokasi bawaan. Koordinat adalah titik pusat kota (pembulatan).
export const PRESET_LOCATIONS: Location[] = [
  {
    id: "yogyakarta",
    name: "Yogyakarta",
    region: "Daerah Istimewa Yogyakarta",
    country: "Indonesia",
    latitude: -7.7956,
    longitude: 110.3695,
  },
  {
    id: "jakarta",
    name: "Jakarta",
    region: "DKI Jakarta",
    country: "Indonesia",
    latitude: -6.2088,
    longitude: 106.8456,
  },
  {
    id: "bandung",
    name: "Bandung",
    region: "Jawa Barat",
    country: "Indonesia",
    latitude: -6.9175,
    longitude: 107.6191,
  },
  {
    id: "surabaya",
    name: "Surabaya",
    region: "Jawa Timur",
    country: "Indonesia",
    latitude: -7.2575,
    longitude: 112.7521,
  },
  {
    id: "medan",
    name: "Medan",
    region: "Sumatera Utara",
    country: "Indonesia",
    latitude: 3.5952,
    longitude: 98.6722,
  },
  {
    id: "makassar",
    name: "Makassar",
    region: "Sulawesi Selatan",
    country: "Indonesia",
    latitude: -5.1477,
    longitude: 119.4327,
  },
];