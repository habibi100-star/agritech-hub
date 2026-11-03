// Bentuk awan yang dipakai bersama oleh beberapa ikon (kotak gambar 48x48).
const CLOUD_PATH =
  "M14 34h20a8 8 0 0 0 .8-15.96A11 11 0 0 0 13.6 20.5 7 7 0 0 0 14 34z";

// Garis sinar matahari: [x1, y1, x2, y2].
const SUN_RAYS: [number, number, number, number][] = [
  [24, 5, 24, 9],
  [24, 39, 24, 43],
  [5, 24, 9, 24],
  [39, 24, 43, 24],
  [10.5, 10.5, 13.3, 13.3],
  [37.5, 10.5, 34.7, 13.3],
  [10.5, 37.5, 13.3, 34.7],
  [37.5, 37.5, 34.7, 34.7],
];

// Menggambar isi ikon sesuai nama ikon.
// Input: icon (nama ikon dari describeWeatherCode).
// Output: elemen SVG (lingkaran, garis, dan jalur) untuk ikon itu.
function IconShapes({ icon }: { icon: string }) {
  switch (icon) {
    case "cerah":
      return (
        <>
          <circle cx="24" cy="24" r="8" />
          {SUN_RAYS.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </>
      );
    case "berawan":
      return (
        <g transform="translate(0 4)">
          <path d={CLOUD_PATH} />
        </g>
      );
    case "kabut":
      return (
        <>
          <path d={CLOUD_PATH} />
          <line x1="10" y1="39" x2="38" y2="39" />
          <line x1="14" y1="44" x2="34" y2="44" />
        </>
      );
    case "gerimis":
      return (
        <>
          <path d={CLOUD_PATH} />
          <line x1="16" y1="38" x2="16" y2="41" />
          <line x1="24" y1="40" x2="24" y2="43" />
          <line x1="32" y1="38" x2="32" y2="41" />
        </>
      );
    case "hujan":
      return (
        <>
          <path d={CLOUD_PATH} />
          <line x1="16" y1="37" x2="13" y2="44" />
          <line x1="25" y1="37" x2="22" y2="44" />
          <line x1="34" y1="37" x2="31" y2="44" />
        </>
      );
    case "salju":
      return (
        <>
          <path d={CLOUD_PATH} />
          <circle cx="16" cy="40" r="1.5" fill="currentColor" />
          <circle cx="24" cy="43" r="1.5" fill="currentColor" />
          <circle cx="32" cy="40" r="1.5" fill="currentColor" />
        </>
      );
    case "badai":
      return (
        <>
          <path d={CLOUD_PATH} />
          <polyline points="27,34 21,41 28,41 23,47" />
        </>
      );
    default:
      // Bentuk cadangan untuk "tidak-diketahui": lingkaran dengan tanda tanya.
      return (
        <>
          <circle cx="24" cy="24" r="17" />
          <path d="M19 20a5 5 0 1 1 7.2 4.5c-1.4.7-2.2 1.6-2.2 3.2" />
          <circle cx="24" cy="34" r="1.2" fill="currentColor" />
        </>
      );
  }
}

// Ikon cuaca berupa SVG inline. Warna mengikuti currentColor, jadi atur
// lewat class teks dari pemanggil (contoh: text-primary).
// Input: icon (nama ikon dari describeWeatherCode), className (opsional, ukuran/warna).
// Output: elemen <svg> yang disembunyikan dari pembaca layar (maknanya ada di teks label).
export default function WeatherIcon({
  icon,
  className = "h-10 w-10",
}: {
  icon: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <IconShapes icon={icon} />
    </svg>
  );
}