import PageComponent from "../../../Client/pages/Gallery";

export async function generateMetadata({ searchParams }) {
  try {
    const itemQuery = await searchParams;
    const itemId = itemQuery?.item;
    
    if (itemId) {
      // Fetch the specific gallery item for OG tags
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tohfabox25.onrender.com';
      const res = await fetch(`${API_URL}/api/gallery/${itemId}`, { next: { revalidate: 3600 } });
      
      if (res.ok) {
        const data = await res.json();
        const galleryItem = data.data || data;
        const imageUrl = galleryItem.image?.url || "/logo.png";
        const title = `${galleryItem.title || "Gallery Item"} | Artistary Crafts`;
        const description = "Check out this beautiful handcrafted piece from our gallery at Artistary Crafts.";

        return {
          title: title,
          description: description,
          openGraph: {
            title: title,
            description: description,
            url: `https://artistarycrafts.vercel.app/gallery?item=${itemId}`,
            siteName: "Artistary Crafts",
            images: [
              {
                url: imageUrl,
                width: 800,
                height: 800,
                alt: galleryItem.title || "Artistary Crafts Gallery Item",
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
      }
    }
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
  }
  
  // Fallback to default metadata
  return {
    title: "Gallery | Artistary Crafts",
    description: "Browse our beautiful handcrafted gallery at Artistary Crafts.",
  };
}

export default function Page(props) {
  return <PageComponent {...props} />;
}
