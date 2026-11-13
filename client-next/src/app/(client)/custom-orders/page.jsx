import PageComponent from "../../../Client/pages/CustomRequest";

export const metadata = {
  title: "Custom Orders & Bespoke Gifts | Artistary Crafts",
  description:
    "Request custom handmade resin art, bespoke crochet items, personalized nameplates, clocks, wedding flower preservation, and custom gift hampers crafted to your exact design at Artistary Crafts.",
  keywords: [
    "Custom Resin Art Orders",
    "Custom Crochet Gifts",
    "Bespoke Resin Clocks",
    "Customized Nameplates Resin",
    "Wedding Garland Preservation",
    "Varmala Preservation Resin",
    "Personalized Gift Hampers",
    "Custom Made Gifts India",
    "Artistary Crafts Custom Orders",
    "Tohfabox Customization",
    "Handmade Gift Commission",
    "Custom Resin Keepsakes"
  ],
  alternates: {
    canonical: "/custom-orders",
  },
  openGraph: {
    title: "Custom Orders & Bespoke Gifts | Artistary Crafts",
    description:
      "Request custom handmade resin art, bespoke crochet items, personalized nameplates, and custom gift hampers tailored for you at Artistary Crafts.",
    url: "/custom-orders",
    siteName: "Artistary Crafts",
  },
};

export default function Page(props) {
  return <PageComponent {...props} />;
}
