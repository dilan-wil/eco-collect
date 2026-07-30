import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoKamer - Gestion intelligente des déchets au Cameroun",
  description: "Application de collecte de déchets intelligente et écologique pour un Cameroun plus propre.",
  keywords: "collecte déchets, Cameroun, écologie, recyclage, environnement, EcoKamer",
  authors: [{ name: "EcoKamer Team" }],
  creator: "EcoKamer",
  publisher: "EcoKamer",
  openGraph: {
    title: "EcoKamer - Collecte intelligente des déchets",
    description: "Simplifiez la gestion des déchets au Cameroun avec EcoKamer",
    type: "website",
    locale: "fr_FR",
    siteName: "EcoKamer",
  },
  icons: {
    icon: "/ecoIcon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
