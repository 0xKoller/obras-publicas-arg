import type { Metadata } from "next";
import { Encode_Sans } from "next/font/google";
import "./globals.css";

const encodeSans = Encode_Sans({
  variable: "--font-encode-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mapa de Obras Publicas - Argentina",
  description:
    "Visualizacion interactiva de las obras publicas de Argentina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="dns-prefetch" href="https://a.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://b.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://c.basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="anonymous" />
      </head>
      <body className={`${encodeSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
