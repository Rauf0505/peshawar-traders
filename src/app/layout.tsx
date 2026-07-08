import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peshawar Traders — Premium Tactical & Outdoor Gear",
  description:
    "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment. Built for the wild. Trusted for life.",
  authors: [{ name: "Peshawar Traders" }],
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
