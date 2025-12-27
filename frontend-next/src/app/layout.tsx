import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { AuthProvider } from "@/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookmarkProvider } from "@/providers/BookmarkProvider";
import { AuthModalProvider } from "@/providers/AuthModalProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "TechPlay.gg - Gaming News, Reviews & Tech",
    template: "%s | TechPlay.gg",
  },
  description: "Your premier destination for gaming news, reviews, tech coverage, and community content.",
  keywords: ["gaming", "reviews", "news", "tech", "esports", "PC gaming"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techplay.gg",
    siteName: "TechPlay.gg",
  },
  twitter: {
    card: "summary_large_image",
    site: "@techplaygg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            <AuthModalProvider>
              <BookmarkProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </BookmarkProvider>
            </AuthModalProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

