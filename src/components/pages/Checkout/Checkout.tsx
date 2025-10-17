import { useAppSelector, useAppDispatch } from "../../store/hooks";
// import { clearCart } from "../../store/cartSlice";
import { useState } from "react";

export const Checkout = () => {
  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();
  console.log(dispatch);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!cart.length) return setError("Cart is empty");

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Call backend to create Checkout Session
      let url: string = import.meta.env.BACKEND_URL; // "https://tohfabox25-backend.onrender.com";
      const res = await fetch(`${url}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to create Checkout Session");
      }

      // 2️⃣ Redirect user to Stripe hosted payment page
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Checkout - Total: $
        {cart
          .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
          .toFixed(2)}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={!cart.length || loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting..." : "Pay Now"}
      </button>
    </div>
  );
};
