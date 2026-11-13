import PageComponent from "../../../Client/pages/Gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://artistarycrafts.vercel.app';
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';

  try {
    const itemQuery = await searchParams;
    const itemId = itemQuery?.item;
    
    if (itemId) {
      const res = await fetch(`${API_URL}/api/gallery/${itemId}`, { next: { revalidate: 3600 } });
      
      if (res.ok) {
        const data = await res.json();
        const galleryItem = data.data || data;
        let imageUrl = galleryItem.image?.url || "/logo.png";
        if (imageUrl.startsWith('/')) imageUrl = `${SITE_URL}${imageUrl}`;

        const title = `${galleryItem.title || "Gallery Showcase"} | Tohfabox`;
        const description = (galleryItem.description || "Check out this beautiful handcrafted resin and crochet piece from our gallery at Tohfabox.")
          .replace(/<[^>]*>?/gm, '')
          .slice(0, 160);

        return {
          title,
          description,
          alternates: {
            canonical: `/gallery?item=${itemId}`,
          },
          openGraph: {
            title,
            description,
            url: `${SITE_URL}/gallery?item=${itemId}`,
            siteName: "Tohfabox",
            images: [
              {
                url: imageUrl,
                width: 800,
                height: 800,
                alt: galleryItem.title || "Tohfabox Gallery Piece",
              },
            ],
            type: 'website',
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
          },
        };
      }
    }
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
  }
  
  return {
    title: "Handcrafted Creations Gallery | Tohfabox",
    description: "Browse our beautiful gallery of handmade resin art, bespoke crochet creations, and personalized gift hampers crafted with love.",
    alternates: {
      canonical: "/gallery",
    },
    openGraph: {
      title: "Handcrafted Creations Gallery | Tohfabox",
      description: "Browse our beautiful gallery of handmade resin art, bespoke crochet creations, and personalized gift hampers crafted with love.",
      url: "/gallery",
    },
  };
}

export default function Page(props) {
  return <PageComponent {...props} />;
}
