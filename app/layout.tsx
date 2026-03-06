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
      <body className={`${encodeSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
