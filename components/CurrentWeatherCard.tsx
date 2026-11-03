import WeatherIcon from "@/components/WeatherIcon";
import { formatLocalTime } from "@/lib/format";
import { describeWeatherCode } from "@/lib/weather-codes";
import type { CurrentWeather, Location } from "@/types";

// Memformat angka ke gaya Indonesia, contoh: 2.4 -> "2,4".
// Input: value (angka), maxDigits (maksimal angka desimal).
// Output: string angka.
function formatNumber(value: number, maxDigits: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: maxDigits });
}

// Membulatkan suhu ke bilangan bulat dan menghindari tampilan "-0".
// Input: value (suhu dalam °C).
// Output: string, contoh: "29".
function formatTemperature(value: number): string {
  return formatNumber(Math.round(value) + 0, 0);
}

// Kartu cuaca saat ini untuk satu lokasi.
// Input: location (lokasi yang dipilih pengguna), current (cuaca saat ini).
// Output: kartu berisi nama kota, ikon, suhu, dan rincian kelembapan, hujan, angin.
export default function CurrentWeatherCard({
  location,
  current,
}: {
  location: Location;
  current: CurrentWeather;
}) {
  const weather = describeWeatherCode(current.weatherCode);
  const area = [location.region, location.country]
    .filter((part) => part.trim() !== "")
    .join(", ");

  const details = [
    { label: "Kelembapan", value: `${formatNumber(current.humidityPercent, 0)}%` },
    { label: "Curah hujan", value: `${formatNumber(current.precipitationMm, 1)} mm` },
    { label: "Kecepatan angin", value: `${formatNumber(current.windSpeedKmh, 1)} km/jam` },
  ];

  return (
    <section
      aria-labelledby="judul-cuaca-sekarang"
      className="rounded-2xl border border-border bg-surface p-6"
    >
      <p className="text-sm font-semibold text-text-muted">Cuaca saat ini</p>
      <h2 id="judul-cuaca-sekarang" className="mt-1 text-2xl font-bold sm:text-3xl">
        {location.name}
      </h2>
      {area !== "" ? <p className="mt-1 text-text-muted">{area}</p> : null}

      <div className="mt-6 flex items-center gap-4">
        <WeatherIcon icon={weather.icon} className="h-16 w-16 shrink-0 text-primary" />
        <div>
          <p className="text-5xl font-bold text-primary-dark">
            {formatTemperature(current.temperatureC)}°C
          </p>
          <p className="mt-1 font-semibold text-text">{weather.label}</p>
        </div>
      </div>

      <p className="mt-3 text-text-muted">
        Terasa seperti {formatTemperature(current.apparentTemperatureC)}°C
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {details.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-background px-4 py-3"
          >
            <dt className="text-sm text-text-muted">{item.label}</dt>
            <dd className="mt-1 text-lg font-bold text-primary-dark">{item.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-text-muted">
        Data pukul {formatLocalTime(current.time)} waktu setempat
      </p>
    </section>
  );
}