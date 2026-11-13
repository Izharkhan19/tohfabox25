import PageComponent from "../../../Client/pages/TermsOfService";

export const metadata = {
  title: "Terms of Service | Tohfabox",
  description: "Review the Terms of Service for Tohfabox covering handcrafted order placement, customization, shipping, and return policies.",
  alternates: {
    canonical: "/terms-of-service",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page(props) {
  return <PageComponent {...props} />;
}
