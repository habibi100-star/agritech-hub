import Link from "next/link";

const footerLinks = [
  { label: "Artikel", href: "/artikel" },
  { label: "Glosarium", href: "/glosarium" },
  { label: "Cuaca", href: "/cuaca" },
  { label: "Alat", href: "/alat" },
];

// Bagian kaki halaman: tautan, catatan sumber data, dan hak cipta.
// Input: tidak ada.
// Output: elemen <footer>.
export default function Footer() {
  return (
    <footer className="bg-primary-dark text-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-heading text-xl font-bold">AgriTech Hub</p>
            <p className="mt-2 text-sm text-background/80">
              Belajar teknologi pertanian dengan bahasa yang mudah dipahami.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-background">Jelajahi</h2>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/80 underline-offset-4 hover:text-background hover:underline focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-background">
              Catatan sumber data
            </h2>
            <p className="mt-3 text-sm text-background/80">
              Semua artikel dan angka di situs ini masih berupa data contoh
              untuk tahap tampilan. Sumber data resmi akan dicantumkan setelah
              tersedia.
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-background/20 pt-6 text-sm text-background/80">
          © 2026 AgriTech Hub. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}