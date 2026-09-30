import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL('https://artistarycrafts.vercel.app'),
  title: {
    default: "Artistary Crafts - Luxury Crochet Art & Bespoke Gifts",
    template: "%s | Artistary Crafts",
  },
  description: "Discover handcrafted crochet art, personalized gift hampers, and timeless custom creations at Artistary Crafts. Perfect gifts for every special occasion.",
  keywords: ["Crochet Art", "Handcrafted Gifts", "Gift Hampers", "Custom Crochet Creations", "Artistary Crafts", "Luxury Gifts", "Personalized Gifts", "Home Decor"],
  authors: [{ name: "Artistary Crafts" }],
  creator: "Artistary Crafts",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://artistarycrafts.vercel.app",
    title: "Artistary Crafts - Luxury Crochet Art & Bespoke Gifts",
    description: "Discover handcrafted crochet art, personalized gift hampers, and timeless custom creations at Artistary Crafts. Perfect gifts for every special occasion.",
    siteName: "Artistary Crafts",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Artistary Crafts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artistary Crafts - Luxury Crochet Art & Bespoke Gifts",
    description: "Discover handcrafted crochet art, personalized gift hampers, and timeless custom creations at Artistary Crafts.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#12343b',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
