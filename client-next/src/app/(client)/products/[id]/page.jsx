import PageComponent from "../../../../Client/pages/ProductDetail";

export async function generateMetadata({ params }) {
  try {
    const id = await params.id;
    
    // We fetch the product details server-side just for the Meta tags
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
    
    // Using native fetch to avoid axios import issues in server components
    const res = await fetch(`${API_URL}/api/products/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    const product = data.product || data;

    // Get the first image URL or fallback to logo
    const imageUrl = product.images?.[0]?.url || product.image?.url || "/logo.png";
    const title = `${product.title || product.name} | Artistary Crafts`;
    const description = product.description || "Check out this beautiful handcrafted crochet item at Artistary Crafts.";

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: `https://artistarycrafts.vercel.app/products/${id}`,
        siteName: "Artistary Crafts",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.title || product.name || "Artistary Crafts Product",
          },
        ],
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    // It will automatically fallback to the default layout.js metadata if this fails
    return {};
  }
}

export default function Page(props) {
  return <PageComponent {...props} />;
}
