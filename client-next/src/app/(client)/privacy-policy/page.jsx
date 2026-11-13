import PageComponent from "../../../Client/pages/PrivacyPolicy";

export const metadata = {
  title: "Privacy Policy | Tohfabox",
  description: "Read the Privacy Policy for Tohfabox. We are committed to safeguarding your personal information, order details, and privacy.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page(props) {
  return <PageComponent {...props} />;
}
