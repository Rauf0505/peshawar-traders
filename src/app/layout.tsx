import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Peshawar Traders — Premium Tactical & Outdoor Gear",
  description:
    "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment. Built for the wild. Trusted for life.",
  authors: [{ name: "Peshawar Traders" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Peshawar Traders",
    description:
      "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment.",
    type: "website",
    images: [
      "https://ik.imagekit.io/chaudaryrauf/wildwood/site/og-image_W-dqwqewx.png",
    ],
  },
  twitter: {
    card: "summary",
    site: "@PeshawarTraders",
    title: "Peshawar Traders",
    description:
      "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment.",
    images: [
      "https://ik.imagekit.io/chaudaryrauf/wildwood/site/og-image_W-dqwqewx.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
