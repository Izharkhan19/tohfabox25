import PageComponent from "../../../Client/pages/Products";

export const metadata = {
  title: "Artistary Crafts | Shop All Handmade Products & Collections",
  description:
    "Explore our complete collection of handmade resin art, crochet flowers, luxury accessories, customized frames, and personalized gifts crafted by Artistary Crafts.",
  keywords: [
    "Shop Handmade Gifts",
    "Buy Resin Art Online",
    "Buy Crochet Flowers",
    "Handmade Resin Coasters",
    "Resin Wall Clocks",
    "Custom Resin Trays",
    "Resin Nameplates",
    "Resin Keychains",
    "Crochet Bouquets",
    "Crochet Soft Toys",
    "Personalized Gift Hampers",
    "Custom Gifts India",
    "Artistary Crafts Products",
    "Tohfabox Catalog",
    "Handcrafted Treasures",
    "Unique Gifts Shop"
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Artistary Crafts | Shop All Handmade Products & Collections",
    description:
      "Explore our complete collection of handmade resin art, crochet flowers, luxury accessories, customized frames, and personalized gifts crafted by Artistary Crafts.",
    url: "/products",
    siteName: "Artistary Crafts",
  },
};

export const revalidate = 60; // Next.js ISR: Revalidate edge cache every 60 seconds

export default function Page(props) {
  return <PageComponent {...props} />;
}
