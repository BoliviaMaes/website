import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bolivia - Autoridades del Estado Plurinacional",
  description:
    "Directorio de los ministros, viceministros y otras máximas autoridades ejecutivas de Bolivia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-BO">
      <body>{children}</body>
    </html>
  );
}
