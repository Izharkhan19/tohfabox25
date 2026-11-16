import PageComponent from "../../../../Client/pages/ProductDetail";

export const revalidate = 60; // Next.js ISR: Revalidate edge cache every 60 seconds

/**
 * Optimizes an image specifically for WhatsApp link preview cards:
 * 1. WhatsApp requires image to be < 300KB (ideally < 100KB).
 * 2. WhatsApp strongly prefers standard JPEG (WebP/AVIF often fail).
 * 3. WhatsApp displays preview cards as square (1:1) thumbnails in chat bubbles.
 */
function getWhatsAppOgImageUrl(rawUrl, siteUrl) {
  if (!rawUrl) return `${siteUrl}/logo.png`;
  let url = rawUrl;
  if (url.startsWith('/')) {
    url = `${siteUrl}${url}`;
  } else if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  // Inject Cloudinary optimizations for WhatsApp:
  // - c_fill,w_800,h_800,g_center: 800x800 square thumbnail
  // - q_80: crisp quality while keeping file size ~50-80KB (well below 300KB limit)
  // - f_jpg: force JPEG format for universal WhatsApp mobile/desktop rendering
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    url = url.replace(
      /\/upload\/(?:[a-zA-Z0-9_,:]+\/)?/,
      '/upload/c_fill,w_800,h_800,g_center,q_80,f_jpg/'
    );
  }

  return url;
}

export async function generateMetadata({ params }) {
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app').replace(/\/$/, '');
  const { id } = await params;

  try {
    const rawApi = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
    const cleanApiBase = rawApi.replace(/\/api\/?$/, '').replace(/\/$/, '');
    
    // Fetch product with a 7-second timeout to avoid crawler blocking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(`${cleanApiBase}/api/products/${id}`, {
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Product metadata fetch returned ${res.status}`);
    
    const data = await res.json();
    const product = data.data?.data || data.data || data.product || data;

    const rawImageUrl =
      product.images?.[0]?.secure_url ||
      product.images?.[0]?.url ||
      product.image?.secure_url ||
      product.image?.url ||
      product.mainImage?.secure_url ||
      product.mainImage?.url ||
      (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
      '/logo.png';

    const optimizedImageUrl = getWhatsAppOgImageUrl(rawImageUrl, SITE_URL);

    const productName = product.title || product.name || 'Handmade Creation';
    const priceText = product.price ? `₹${Number(product.price).toFixed(2)}` : '';
    const title = `${productName}${priceText ? ` - ${priceText}` : ''} | Artistary Crafts`;
    
    const cleanDescription = (product.description || "Discover custom handcrafted resin art, luxury crochet creations, and personalized gift hampers at Artistary Crafts.")
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);

    const categoryName = product.category?.name || (typeof product.category === 'string' ? product.category : 'Handcrafted');
    const productKeywords = [
      productName,
      `buy ${productName}`,
      `${productName} price`,
      categoryName,
      `handmade ${categoryName}`,
      "Artistary Crafts",
      "Artistarycraft",
      "Tohfabox",
      "Handmade Gifts",
      "Customized Gifts Online",
      "Resin Art India",
      "Handcrafted Treasures"
    ];

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description: cleanDescription,
      keywords: productKeywords,
      alternates: {
        canonical: `/products/${id}`,
      },
      openGraph: {
        title,
        description: cleanDescription,
        url: `${SITE_URL}/products/${id}`,
        siteName: "Artistary Crafts (Tohfabox)",
        images: [
          {
            url: optimizedImageUrl,
            secureUrl: optimizedImageUrl,
            width: 800,
            height: 800,
            alt: productName,
            type: optimizedImageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
          },
        ],
        locale: "en_IN",
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: cleanDescription,
        images: [optimizedImageUrl],
      },
      other: {
        'og:image:secure_url': optimizedImageUrl,
        'og:image:type': optimizedImageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
        'og:image:width': '800',
        'og:image:height': '800',
      }
    };
  } catch (error) {
    console.error("Error generating product metadata:", error.message);
    const fallbackImage = `${SITE_URL}/logo.png`;
    return {
      metadataBase: new URL(SITE_URL),
      title: "Handmade Product Details | Artistary Crafts (Tohfabox)",
      description: "Discover custom handcrafted resin art, luxury crochet creations, and personalized gift hampers at Artistary Crafts.",
      openGraph: {
        title: "Handmade Product Details | Artistary Crafts (Tohfabox)",
        description: "Discover custom handcrafted resin art and personalized gifts at Artistary Crafts.",
        url: `${SITE_URL}/products/${id}`,
        siteName: "Artistary Crafts (Tohfabox)",
        images: [
          {
            url: fallbackImage,
            secureUrl: fallbackImage,
            width: 800,
            height: 800,
            alt: "Artistary Crafts",
            type: "image/png",
          },
        ],
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title: "Handmade Product Details | Artistary Crafts",
        description: "Discover custom handcrafted resin art and luxury crochet items at Artistary Crafts.",
        images: [fallbackImage],
      },
      other: {
        'og:image:secure_url': fallbackImage,
        'og:image:type': 'image/png',
        'og:image:width': '800',
        'og:image:height': '800',
      }
    };
  }
}

export default async function Page(props) {
  const { id } = await props.params;
  const rawApi = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
  const cleanApiBase = rawApi.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app').replace(/\/$/, '');

  let productSchema = null;
  let ogMeta = null;

  try {
    const res = await fetch(`${cleanApiBase}/api/products/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const product = json.data?.data || json.data || json.product || json;
      
      const rawImageUrl =
        product.images?.[0]?.secure_url ||
        product.images?.[0]?.url ||
        product.image?.secure_url ||
        product.image?.url ||
        product.mainImage?.secure_url ||
        product.mainImage?.url ||
        (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
        `${SITE_URL}/logo.png`;

      const imageUrl = getWhatsAppOgImageUrl(rawImageUrl, SITE_URL);
      const productName = product.title || product.name || 'Handmade Creation';
      const cleanDesc = (product.description || "").replace(/<[^>]*>?/gm, '').slice(0, 500);

      ogMeta = {
        title: `${productName} | Artistary Crafts`,
        description: cleanDesc.slice(0, 160),
        image: imageUrl,
        url: `${SITE_URL}/products/${id}`,
      };

      productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productName,
        "image": [imageUrl],
        "description": cleanDesc,
        "sku": product._id || id,
        "brand": {
          "@type": "Brand",
          "name": "Artistary Crafts"
        },
        "offers": {
          "@type": "Offer",
          "url": `${SITE_URL}/products/${id}`,
          "priceCurrency": "INR",
          "price": product.price || 0,
          "availability": (product.stock > 0 || product.inStock !== false)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };
    }
  } catch {
    // Schema fetch is non-blocking
  }

  return (
    <>
      {ogMeta && (
        <head>
          <meta property="og:title" content={ogMeta.title} />
          <meta property="og:description" content={ogMeta.description} />
          <meta property="og:image" content={ogMeta.image} />
          <meta property="og:image:secure_url" content={ogMeta.image} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="800" />
          <meta property="og:image:height" content="800" />
          <meta property="og:url" content={ogMeta.url} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Artistary Crafts (Tohfabox)" />
        </head>
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <PageComponent {...props} />
    </>
  );
}
