import PageComponent from "../../../Client/pages/AppInfo";

export const metadata = {
  title: "About Us | Our Story & Craftsmanship",
  description:
    "Learn about Tohfabox — dedicated to creating exquisite handmade resin art, crochet flowers, luxury hampers, and personalized handcrafted memories.",
  alternates: {
    canonical: "/app-info",
  },
  openGraph: {
    title: "About Us | Our Story & Craftsmanship | Tohfabox",
    description:
      "Learn about Tohfabox — dedicated to creating exquisite handmade resin art, crochet flowers, luxury hampers, and personalized handcrafted memories.",
    url: "/app-info",
  },
};

export default function Page(props) {
  return <PageComponent {...props} />;
}
