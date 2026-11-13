import PageComponent from "../../../Client/pages/CustomRequest";

export const metadata = {
  title: "Custom Orders & Bespoke Gifts | Resin & Crochet Customization",
  description:
    "Request custom handmade resin art, bespoke crochet items, personalized nameplates, clocks, and custom gift hampers crafted to your exact design at Tohfabox.",
  alternates: {
    canonical: "/custom-orders",
  },
  openGraph: {
    title: "Custom Orders & Bespoke Gifts | Tohfabox",
    description:
      "Request custom handmade resin art, bespoke crochet items, personalized nameplates, and custom gift hampers tailored for you.",
    url: "/custom-orders",
  },
};

export default function Page(props) {
  return <PageComponent {...props} />;
}
