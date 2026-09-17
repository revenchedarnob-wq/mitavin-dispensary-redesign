import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Mitavin — The Authentic Longevity & Pediatric Dispensary",
  description:
    "100% verified UK & USA imported baby nutrition, clinical dermatology, and micronutrients delivered in Dhaka within 4 hours.",
  keywords: [
    "Mitavin",
    "Aptamil Gold Dhaka",
    "Vitabiotics Pregnacare Dhaka",
    "Kirkland Minoxidil Bangladesh",
    "CeraVe genuine Dhaka",
    "VivaChek Ino Strips",
    "Authentic baby formula Dhaka",
  ],
  openGraph: {
    title: "Mitavin — The Authentic Longevity & Pediatric Dispensary",
    description: "100% verified UK & USA imported baby nutrition, clinical dermatology, and micronutrients.",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased selection:bg-zinc-900 selection:text-white bg-white text-zinc-900 font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
