import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mening Tizimim",
  description: "Shaxsiy biznes, loyiha, mijoz, shartnoma va moliya boshqaruv platformasi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
