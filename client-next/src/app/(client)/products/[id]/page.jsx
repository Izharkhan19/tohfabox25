import PageComponent from "../../../../Client/pages/ProductDetail";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app';
    
    const res = await fetch(`${API_URL}/api/products/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch product metadata');
    
    const data = await res.json();
    const product = data.data || data.product || data;

    let imageUrl = product.images?.[0]?.url || product.image?.url || "/logo.png";
    if (imageUrl.startsWith('/')) {
      imageUrl = `${SITE_URL}${imageUrl}`;
    } else if (imageUrl.startsWith('http://')) {
      imageUrl = imageUrl.replace('http://', 'https://');
    }

    const title = `${product.title || product.name || 'Handmade Product'} | Artistary Crafts`;
    const cleanDescription = (product.description || "Discover custom handcrafted resin art, luxury crochet creations, and personalized gift hampers at Artistary Crafts.")
      .replace(/<[^>]*>?/gm, '')
      .slice(0, 160);

    const productName = product.title || product.name || 'Handmade Gift';
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
        siteName: "Artistary Crafts",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.title || product.name || "Artistary Crafts Handmade Gift",
          },
        ],
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: cleanDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error.message);
    return {
      title: "Handmade Product Details | Artistary Crafts",
      description: "Discover custom handcrafted resin art and luxury crochet items at Artistary Crafts.",
    };
  }
}

export default async function Page(props) {
  const { id } = await props.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app';

  let productSchema = null;
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const product = json.data || json.product || json;
      let imageUrl = product.images?.[0]?.url || product.image?.url || `${SITE_URL}/logo.png`;
      if (imageUrl.startsWith('/')) imageUrl = `${SITE_URL}${imageUrl}`;

      productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title || product.name,
        "image": [imageUrl],
        "description": (product.description || "").replace(/<[^>]*>?/gm, '').slice(0, 500),
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
  } catch (e) {
    // Schema fetch is non-blocking
  }

  return (
    <>
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
