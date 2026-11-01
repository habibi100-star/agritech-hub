import Link from "next/link";
import type { ReactNode } from "react";

const baseStyle =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-colors";

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white",
  light:
    "bg-surface text-primary-dark hover:bg-background focus-visible:outline-accent",
} as const;

// Tombol berbentuk tautan.
// Input: href (tujuan), variant ("primary" | "outline" | "light"), children (teks tombol).
// Output: elemen <a> bergaya tombol.
export default function Button({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: keyof typeof variantStyles;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${baseStyle} ${variantStyles[variant]}`}>
      {children}
    </Link>
  );
}