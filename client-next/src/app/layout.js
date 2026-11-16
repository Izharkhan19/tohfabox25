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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app';

export const metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Artistary Crafts | Handmade Resin & Crochet Gifts | Tohfabox",
    template: "%s | Artistary Crafts",
  },
  description: "Shop custom handmade resin art, luxury crochet creations, personalized gift hampers, and bespoke handcrafted treasures at Artistary Crafts. Perfect for birthdays, anniversaries, and special moments.",
  keywords: [
    // Brand & Name Variations
    "Artistary Crafts",
    "Artistarycrafts",
    "Artistary craft",
    "Artistarycraft",
    "Artistary",
    "Tohfabox",
    "Tohfabox25",
    "Tohfa box",
    "Tohfa box 25",
    
    // Resin Art & Crafts
    "Resin Art",
    "Resin Art India",
    "Handmade Resin Gifts",
    "Resin Clocks",
    "Resin Wall Clock",
    "Geode Wall Art",
    "Resin Geode Clock",
    "Resin Coasters",
    "Ocean Resin Coasters",
    "Resin Nameplates",
    "Custom Resin Nameplates",
    "Resin Keychains",
    "Custom Initial Keychains",
    "Resin Trays",
    "Resin Serving Trays",
    "Floral Keepsake Tray",
    "Resin Photo Frames",
    "Preserved Flower Resin Frames",
    "Varmala Preservation",
    "Wedding Garland Preservation Resin",
    "Resin Bookmarks",
    "Resin Jewelry",
    "Resin Mantra Frames",
    "Resin Ocean Art",
    "Epoxy Resin Art",
    "Customized Resin Gifts",
    "Resin Art Decor",

    // Crochet Art & Knitted Items
    "Crochet Art",
    "Handmade Crochet",
    "Crochet Flowers",
    "Crochet Flower Bouquet",
    "Handmade Crochet Bouquet",
    "Crochet Rose Bouquet",
    "Crochet Sunflowers",
    "Crochet Tulips",
    "Crochet Lavender",
    "Crochet Plushies",
    "Crochet Amigurumi",
    "Crochet Soft Toys",
    "Crochet Keychains",
    "Crochet Bags",
    "Crochet Tote Bag",
    "Crochet Home Decor",
    "Crochet Table Runners",
    "Crochet Accessories",
    "Knitted Gifts",
    "Custom Crochet Creations",
    "Woolen Handcrafted Gifts",

    // Personalized Gifts & Hampers
    "Personalized Gifts",
    "Customized Gifts Online",
    "Customized Gifts India",
    "Luxury Gift Hampers",
    "Curated Gift Hampers",
    "Handmade Gift Hampers",
    "Handmade Gifts",
    "Handcrafted Treasures",
    "Bespoke Gifts",
    "Personalized Keepsakes",
    "Unique Handmade Gifts",
    "Creative Gift Ideas",

    // Occasions & Recipient Gifting
    "Birthday Gifts",
    "Unique Birthday Gifts",
    "Anniversary Gifts",
    "Wedding Gifts",
    "Couple Gifts",
    "Valentine Day Gifts",
    "Mother's Day Gifts",
    "Father's Day Gifts",
    "Rakhi Gifts",
    "Rakshabandhan Hampers",
    "Diwali Gift Hampers",
    "New Year Gifts",
    "Christmas Gifts",
    "Corporate Gifts",
    "Return Gifts",
    "Housewarming Gifts",
    "Baby Shower Gifts",

    // Home Decor & Aesthetics
    "Handcrafted Home Decor",
    "Aesthetic Room Decor",
    "Modern Resin Art",
    "Luxury Handicrafts",
    "Art and Craft Gifts Online",

    // Commercial & Buying Intent Terms
    "Buy Resin Art Online",
    "Buy Crochet Flowers Online",
    "Custom Gift Shop India",
    "Best Handmade Gift Store",
    "Online Gift Store India",
    "Handmade Crafts Shop"
  ],
  authors: [{ name: "Artistary Crafts", url: SITE_URL }],
  creator: "Artistary Crafts",
  publisher: "Artistary Crafts",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Artistary Crafts | Handmade Resin & Crochet Gifts",
    description: "Shop custom handmade resin art, luxury crochet creations, and personalized gift hampers crafted with love at Artistary Crafts.",
    siteName: "Artistary Crafts",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        secureUrl: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Artistary Crafts Handmade Resin & Crochet Gifts",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artistary Crafts | Handmade Resin & Crochet Gifts",
    description: "Shop custom handmade resin art, luxury crochet creations, and personalized gift hampers crafted with love at Artistary Crafts.",
    images: [`${SITE_URL}/logo.png`],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Artistary Crafts",
    startupImage: ["/icon-maskable-512x512.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon-maskable-512x512.png",
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
      "name": "Artistary Crafts",
      "alternateName": ["Tohfabox", "Tohfabox25", "Artistarycraft"],
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "width": 512,
        "height": 512
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+919079841327",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Artistary Crafts",
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
