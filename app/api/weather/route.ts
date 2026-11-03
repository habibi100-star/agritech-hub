import { NextResponse, type NextRequest } from "next/server";
import { getWeather } from "@/lib/weather";

const COORDINATE_PATTERN = /^-?\d+(\.\d+)?$/;

const CACHE_OK = "public, max-age=60, s-maxage=600, stale-while-revalidate=300";
const CACHE_NONE = "no-store";

// Membaca satu koordinat dari alamat dan memeriksa rentangnya.
// Input: raw (teks parameter, atau null bila tidak ada), min dan max (batas).
// Output: angka valid, atau null bila kosong, bukan angka, atau di luar rentang.
function parseCoordinate(
  raw: string | null,
  min: number,
  max: number,
): number | null {
  if (raw === null) return null;
  const text = raw.trim();
  if (!COORDINATE_PATTERN.test(text)) return null;
  const value = Number(text);
  return value >= min && value <= max ? value : null;
}

// GET /api/weather?lat=&lon=
// Input: parameter alamat lat (-90..90) dan lon (-180..180).
// Output: 200 + WeatherReport, 400 + { error } bila parameter salah,
// 502 + { error } bila layanan cuaca gagal.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const latitude = parseCoordinate(searchParams.get("lat"), -90, 90);
  const longitude = parseCoordinate(searchParams.get("lon"), -180, 180);

  if (latitude === null || longitude === null) {
    return NextResponse.json(
      {
        error:
          "Koordinat tidak valid. Isi lat dengan angka -90 sampai 90 dan lon dengan angka -180 sampai 180.",
      },
      { status: 400, headers: { "Cache-Control": CACHE_NONE } },
    );
  }

  try {
    const report = await getWeather(latitude, longitude);
    return NextResponse.json(report, {
      headers: { "Cache-Control": CACHE_OK },
    });
  } catch (error) {
    // Detail teknis hanya dicatat di terminal server, tidak dikirim ke pengguna.
    console.error("Gagal memuat cuaca:", error);
    return NextResponse.json(
      { error: "Data cuaca sedang tidak bisa dimuat. Silakan coba lagi nanti." },
      { status: 502, headers: { "Cache-Control": CACHE_NONE } },
    );
  }
}