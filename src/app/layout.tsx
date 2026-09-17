import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

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

export const viewport: Viewport = {
  themeColor: "#FAF9F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Mitavin — Genuine UK & USA Health, Longevity & Pediatric Care in Dhaka",
  description:
    "Direct air-freighted authentic Aptamil, Vitabiotics, Kirkland Minoxidil, and CeraVe. 100% genuine UK and USA imports with temperature logging and 10x money-back authenticity pledge.",
  keywords: [
    "Mitavin Bangladesh",
    "Aptamil Gold Dhaka",
    "Vitabiotics Pregnacare Dhaka",
    "Kirkland Minoxidil Bangladesh",
    "CeraVe genuine Dhaka",
    "VivaChek Ino Strips",
    "Authentic baby milk Dhaka",
  ],
  openGraph: {
    title: "Mitavin — Genuine UK & USA Health, Longevity & Pediatric Care in Dhaka",
    description: "100% Counterfeit-Free Dispensary. Direct air-freighted from British and American laboratories.",
    siteName: "Mitavin Healthcare",
    locale: "en_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="antialiased selection:bg-brand-emerald-light selection:text-ink-primary bg-canvas text-ink-primary">
        {/* Subtle Tactile Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
