import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/components/data-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: { default: "Mening Tizimim", template: "%s · Mening Tizimim" },
  description: "Shaxsiy biznes, loyiha, mijoz, shartnoma, vazifa va moliya boshqaruv platformasi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
