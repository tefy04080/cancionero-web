import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cancionero del Beni | Música Tradicional del Oriente Boliviano",
  description:
    "Plataforma comunitaria del patrimonio musical del Departamento del Beni, Bolivia. Taquirari, Chovena, Macheteros y más ritmos de nuestra cultura beniana.",
  keywords: ["Beni", "Bolivia", "Taquirari", "Chovena", "Macheteros", "música tradicional", "cancionero"],
  openGraph: {
    title: "Cancionero del Beni",
    description: "El patrimonio musical del Oriente Boliviano",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased jungle-bg min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-beni-deep/30 py-8 text-center">
            <p className="text-beni-sand/50 text-sm font-body">
              🌿 Cancionero del Beni — Preservando la cultura musical del Oriente Boliviano
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
