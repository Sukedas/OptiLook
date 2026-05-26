import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OptiLook",
  description: "App para recomendar monturas según el tipo de rostro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
