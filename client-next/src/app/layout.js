import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tohfabox25.vercel.app';

export const metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tohfabox | Handmade Resin & Crochet Gifts | Personalized Hampers",
    template: "%s | Tohfabox",
  },
  description: "Shop custom handmade resin art, luxury crochet creations, personalized gift hampers, and bespoke handcrafted treasures at Tohfabox. Perfect for birthdays, anniversaries, and special moments.",
  keywords: [
    "Tohfabox",
    "Tohfabox25",
    "Handmade Gifts",
    "Resin Art",
    "Crochet Art",
    "Handmade Resin Gifts",
    "Crochet Flowers",
    "Personalized Gifts",
    "Custom Gift Hampers",
    "Artistary Crafts",
    "Handcrafted Treasures",
    "Resin Clocks",
    "Resin Nameplates",
    "Resin Keychains",
    "Custom Gifts India"
  ],
  authors: [{ name: "Tohfabox", url: SITE_URL }],
  creator: "Tohfabox",
  publisher: "Tohfabox",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Tohfabox | Handmade Resin & Crochet Gifts",
    description: "Shop custom handmade resin art, luxury crochet creations, and personalized gift hampers crafted with love at Tohfabox.",
    siteName: "Tohfabox",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tohfabox Handmade Resin & Crochet Gifts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tohfabox | Handmade Resin & Crochet Gifts",
    description: "Shop custom handmade resin art, luxury crochet creations, and personalized gift hampers crafted with love at Tohfabox.",
    images: ["/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tohfabox",
    startupImage: ["/splash.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
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

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Tohfabox",
      "alternateName": ["Artistary Crafts", "Tohfabox25"],
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "width": 512,
        "height": 512
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917737510030",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Tohfabox",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/products?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-M2FLN559D6" />
    </html>
  );
}
