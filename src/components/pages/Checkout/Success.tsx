import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export const Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [invoiceUrl, setInvoiceUrl] = useState<string>("");

  // Fetch Stripe session and generate custom invoice
  const fetchSession = async () => {
    if (!sessionId) return;

    try {
      // Step 1: Fetch Stripe checkout session details
      let url: string = import.meta.env.BACKEND_URL; //  "https://tohfabox25-backend.onrender.com";
      const res = await fetch(`${url}/api/stripe/session/${sessionId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch session");

      setSession(data);

      // Step 2: Generate custom invoice PDF from backend
      const invoiceRes = await fetch(`${url}/api/generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          // "cs_test_a1QbE3ArionX8txZOadNyDWNCTjmoLPlEw6vXgFWENTvtgu0xwlh6Ubeum", // use session id from Stripe
        }),
      });

      const invoiceData = await invoiceRes.json();
      if (invoiceData.success && invoiceData.invoiceUrl) {
        setInvoiceUrl(`${url}${invoiceData.invoiceUrl}`);
      }
    } catch (err: any) {
      console.error("Error fetching session:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  // Error state
  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        ❌ {error}
      </div>
    );

  // Loading state
  if (!session)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading payment details...
      </div>
    );

  // Extract customer and amount info
  const customer = session.customer_details || {};
  const totalAmount = (session.amount_total / 100).toFixed(2);
  const currency = session.currency?.toUpperCase();

  return (
    <div className="container mt-12 p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>

      <div className="text-gray-700 space-y-2">
        <p>
          <strong>Payment ID:</strong> {session.id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize text-green-700">
            {session.payment_status}
          </span>
        </p>
        <p>
          <strong>Amount Paid:</strong> ${totalAmount} {currency}
        </p>
        {customer.name && (
          <p>
            <strong>Customer Name:</strong> {customer.name}
          </p>
        )}
        {customer.email && (
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
        )}
        {customer.address && (
          <p>
            <strong>Country:</strong> {customer.address.country || "N/A"}
          </p>
        )}
      </div>

      <hr className="my-6 border-gray-300" />

      {/* If Stripe generated invoice exists */}
      {session.invoice?.invoice_pdf ? (
        <a
          href={session.invoice.invoice_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📄 Download Stripe Invoice
        </a>
      ) : invoiceUrl ? (
        // If backend generated invoice exists
        <a
          href={invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📄 Download Custom Invoice
        </a>
      ) : (
        <p className="text-gray-600">Invoice not available yet...</p>
      )}

      <div className="mt-6">
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          🛍️ Continue Shopping
        </Link>
      </div>
    </div>
  );
};
