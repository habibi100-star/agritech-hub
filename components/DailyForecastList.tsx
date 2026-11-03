import WeatherIcon from "@/components/WeatherIcon";
import { formatForecastDay } from "@/lib/format";
import { describeWeatherCode } from "@/lib/weather-codes";
import type { DailyForecast } from "@/types";

// Memformat angka ke gaya Indonesia, contoh: 2.4 -> "2,4".
// Input: value (angka), maxDigits (maksimal angka desimal).
// Output: string angka.
function formatNumber(value: number, maxDigits: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: maxDigits });
}

// Membulatkan suhu ke bilangan bulat dan menghindari tampilan "-0".
// Input: value (suhu dalam °C).
// Output: string, contoh: "31".
function formatTemperature(value: number): string {
  return formatNumber(Math.round(value) + 0, 0);
}

// Daftar prakiraan harian berurutan.
// Input: daily (prakiraan per hari), currentTime (current.time, contoh: "2026-11-03T14:00").
// Output: daftar <ol>. Baris "Hari ini" ditentukan dengan membandingkan teks
// tanggal dengan 10 karakter pertama currentTime (tanpa new Date).
export default function DailyForecastList({
  daily,
  currentTime,
}: {
  daily: DailyForecast[];
  currentTime: string;
}) {
  const todayDate = currentTime.slice(0, 10);

  return (
    <section aria-labelledby="judul-prakiraan">
      <h2 id="judul-prakiraan" className="text-2xl font-bold sm:text-3xl">
        Prakiraan {daily.length} hari
      </h2>

      <ol className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {daily.map((day) => {
          const weather = describeWeatherCode(day.weatherCode);
          const isToday = day.date === todayDate;
          const probability =
            day.precipitationProbabilityPercent === null
              ? "Tidak tersedia"
              : `${formatNumber(day.precipitationProbabilityPercent, 0)}%`;

          const metrics = [
            {
              label: "Suhu maks/min",
              value: `${formatTemperature(day.tempMaxC)}°C / ${formatTemperature(day.tempMinC)}°C`,
            },
            {
              label: "Jumlah hujan",
              value: `${formatNumber(day.precipitationSumMm, 1)} mm`,
            },
            { label: "Peluang hujan", value: probability },
          ];

          return (
            <li
              key={day.date}
              className="grid gap-3 p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,2.6fr)] md:items-center"
            >
              <div>
                {isToday ? (
                  <span className="mb-1 inline-block rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-primary-dark">
                    Hari ini
                  </span>
                ) : null}
                <p className="font-bold text-primary-dark">
                  {formatForecastDay(day.date)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <WeatherIcon icon={weather.icon} className="h-9 w-9 shrink-0 text-primary" />
                <p className="font-semibold text-text">{weather.label}</p>
              </div>

              <dl className="grid grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <dt className="text-xs text-text-muted">{metric.label}</dt>
                    <dd className="mt-0.5 wrap-break-word text-sm font-semibold text-text">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ol>
    </section>
  );
}