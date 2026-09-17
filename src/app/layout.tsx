import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mitavin | Verified Genuine Healthcare & Luxury Longevity",
  description:
    "Bangladesh's premier authentic dispensary for verified air-imported infant nutrition, clinical dermatology, diagnostics, and longevity vitamins. 100% counterfeit-free.",
  keywords: [
    "Mitavin",
    "authentic healthcare Bangladesh",
    "Aptamil Bangladesh",
    "Vitabiotics Dhaka",
    "Kirkland Minoxidil Dhaka",
    "CeraVe genuine",
    "VivaChek Ino test strips",
  ],
  authors: [{ name: "Mitavin Healthcare Laboratories" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="antialiased selection:bg-brand-emerald-light selection:text-ink-primary">
        {/* Subtle Tactile Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
