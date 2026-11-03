import { NextResponse, type NextRequest } from "next/server";
import { searchLocations } from "@/lib/weather";

const CACHE_OK =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";
const CACHE_NONE = "no-store";

// GET /api/geocode?q=
// Input: parameter alamat q (2 sampai 60 karakter setelah di-trim).
// Output: 200 + Location[] (boleh kosong), 400 + { error } bila q salah,
// 502 + { error } bila layanan pencarian gagal.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2 || query.length > 60) {
    return NextResponse.json(
      { error: "Kata kunci pencarian harus 2 sampai 60 karakter." },
      { status: 400, headers: { "Cache-Control": CACHE_NONE } },
    );
  }

  try {
    const locations = await searchLocations(query);
    return NextResponse.json(locations, {
      headers: { "Cache-Control": CACHE_OK },
    });
  } catch (error) {
    // Detail teknis hanya dicatat di terminal server, tidak dikirim ke pengguna.
    console.error("Gagal mencari lokasi:", error);
    return NextResponse.json(
      { error: "Pencarian lokasi sedang tidak bisa dilakukan. Silakan coba lagi nanti." },
      { status: 502, headers: { "Cache-Control": CACHE_NONE } },
    );
  }
}