import PageComponent from "../../../Client/pages/Gallery";

export const dynamic = "force-dynamic";

function getWhatsAppOgImageUrl(rawUrl, siteUrl) {
  if (!rawUrl) return `${siteUrl}/logo.png`;
  let url = rawUrl;
  if (url.startsWith('/')) {
    url = `${siteUrl}${url}`;
  } else if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  // Force square, JPEG, and <100KB for universal WhatsApp link preview support
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    url = url.replace(
      /\/upload\/(?:[a-zA-Z0-9_,:]+\/)?/,
      '/upload/c_fill,w_800,h_800,g_center,q_80,f_jpg/'
    );
  }
  return url;
}

export async function generateMetadata({ searchParams }) {
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app').replace(/\/$/, '');
  const rawApi = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
  const cleanApiBase = rawApi.replace(/\/api\/?$/, '').replace(/\/$/, '');

  try {
    const itemQuery = await searchParams;
    const itemId = itemQuery?.item;
    
    if (itemId) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${cleanApiBase}/api/gallery/${itemId}`, {
        next: { revalidate: 3600 },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        const galleryItem = data.data || data;
        const rawImageUrl = galleryItem.image?.url || `${SITE_URL}/logo.png`;
        const optimizedImage = getWhatsAppOgImageUrl(rawImageUrl, SITE_URL);

        const title = `${galleryItem.title || "Gallery Showcase"} | Artistary Crafts (Tohfabox)`;
        const description = (galleryItem.description || "Check out this beautiful handcrafted resin and crochet piece from our gallery at Artistary Crafts.")
          .replace(/<[^>]*>?/gm, '')
          .slice(0, 160);

        return {
          metadataBase: new URL(SITE_URL),
          title,
          description,
          alternates: {
            canonical: `/gallery?item=${itemId}`,
          },
          openGraph: {
            title,
            description,
            url: `${SITE_URL}/gallery?item=${itemId}`,
            siteName: "Artistary Crafts (Tohfabox)",
            images: [
              {
                url: optimizedImage,
                secureUrl: optimizedImage,
                width: 800,
                height: 800,
                alt: galleryItem.title || "Tohfabox Gallery Piece",
                type: optimizedImage.endsWith('.png') ? 'image/png' : 'image/jpeg',
              },
            ],
            type: 'website',
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [optimizedImage],
          },
          other: {
            'og:image:secure_url': optimizedImage,
            'og:image:type': optimizedImage.endsWith('.png') ? 'image/png' : 'image/jpeg',
            'og:image:width': '800',
            'og:image:height': '800',
          }
        };
      }
    }
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
  }
  
  const defaultGalleryImage = `${SITE_URL}/logo.png`;
  return {
    metadataBase: new URL(SITE_URL),
    title: "Handcrafted Creations Gallery | Artistary Crafts (Tohfabox)",
    description: "Browse our beautiful gallery of handmade resin art, bespoke crochet creations, and personalized gift hampers crafted with love at Artistary Crafts.",
    keywords: [
      "Artistary Crafts Gallery",
      "Handmade Crafts Portfolio",
      "Resin Art Showcase",
      "Crochet Creations Gallery",
      "Handmade Art Designs",
      "Resin Clock Designs",
      "Crochet Flower Designs",
      "Tohfabox Gallery"
    ],
    alternates: {
      canonical: "/gallery",
    },
    openGraph: {
      title: "Handcrafted Creations Gallery | Artistary Crafts (Tohfabox)",
      description: "Browse our beautiful gallery of handmade resin art, bespoke crochet creations, and personalized gift hampers crafted with love at Artistary Crafts.",
      url: `${SITE_URL}/gallery`,
      siteName: "Artistary Crafts",
      images: [
        {
          url: defaultGalleryImage,
          secureUrl: defaultGalleryImage,
          width: 800,
          height: 800,
          alt: "Artistary Crafts Gallery",
          type: "image/png",
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Handcrafted Creations Gallery | Artistary Crafts",
      description: "Browse our beautiful gallery of handmade resin art, bespoke crochet creations, and personalized gift hampers.",
      images: [defaultGalleryImage],
    },
    other: {
      'og:image:secure_url': defaultGalleryImage,
      'og:image:type': 'image/png',
      'og:image:width': '800',
      'og:image:height': '800',
    }
  };
}

export default function Page(props) {
  return <PageComponent {...props} />;
}
