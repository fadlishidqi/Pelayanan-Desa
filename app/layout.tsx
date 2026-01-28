import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// IMPORT DARI FILE BARU TADI
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desa Pondok",
  description: "Sistem Informasi Desa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}