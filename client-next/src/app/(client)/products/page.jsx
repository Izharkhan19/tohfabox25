import PageComponent from "../../../Client/pages/Products";

export const metadata = {
  title: "Shop All Handmade Products | Resin Art & Crochet Collections",
  description:
    "Explore our complete collection of handmade resin art, crochet flowers, luxury accessories, customized frames, and personalized gifts crafted by Tohfabox.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Shop All Handmade Products | Resin Art & Crochet Collections | Tohfabox",
    description:
      "Explore our complete collection of handmade resin art, crochet flowers, luxury accessories, customized frames, and personalized gifts crafted by Tohfabox.",
    url: "/products",
  },
};

export default function Page(props) {
  return <PageComponent {...props} />;
}
