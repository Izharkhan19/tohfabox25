import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCardIcon,
  BanknotesIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import {
  createOrder,
  confirmOrder,
  getCurrentUser,
  validatePromo,
} from "../../api-services/apiService";
import LogoLoader from "../../components/LogoLoader";
import { useAppStore } from "../../stores/useAppStore";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [error, setError] = useState(null);
  const cachedCartItems = useAppStore((state) => state.cartItems);
  const fetchSharedCart = useAppStore((state) => state.fetchCart);

  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const fetchCart = async () => {
    setLoadingCart(true);
    const result = cachedCartItems
      ? { success: true, data: { data: cachedCartItems } }
      : await fetchSharedCart();
    if (result.success && Array.isArray(result?.data?.data)) {
      const validItems = result.data.data.filter(
        (item) => item && item.product && (item._id || item.product._id),
      );
      setCartItems(validItems);
    } else {
      setCartItems([]);
    }
    setLoadingCart(false);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    const result = await getCurrentUser();
    if (result.success && result.data) {
      const user = result.data;
      setFormData({
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        apartment: user.address?.apartment || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.zipCode || "",
      });
    }
    setLoadingUser(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [cachedCartItems, fetchSharedCart]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0,
  );
  const shippingCost = subtotal >= 100 ? 0 : 12.9;
  const discount = appliedPromo?.discount || 0;
  const total = subtotal + shippingCost - discount;

  const handleWhatsAppOrder = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919000000000"; // Fallback number
    let message = "Hello! I would like to place an order for the following items:\n\n";
    
    cartItems.forEach((item, index) => {
      const product = item.product;
      message += `${index + 1}. *${product.name}* (x${item.quantity}) - ₹${(product.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal:* ₹${subtotal.toFixed(2)}`;
    if (shippingCost > 0) {
      message += `\n*Shipping:* ₹${shippingCost.toFixed(2)}`;
    }
    if (discount > 0) {
      message += `\n*Discount:* -₹${discount.toFixed(2)}`;
    }
    message += `\n*Total Amount:* ₹${total.toFixed(2)}\n\n`;
    
    // Add customer details if available
    if (formData.firstName || formData.phone) {
      message += `*Customer Details:*\n`;
      if (formData.firstName) message += `Name: ${formData.firstName} ${formData.lastName}\n`;
      if (formData.phone) message += `Phone: ${formData.phone}\n`;
      if (formData.address) message += `Address: ${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}\n`;
      message += `\n`;
    }

    message += `Please guide me with the UPI / Cash on Delivery (COD) payment options.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.info("Enter a promo code first");
      return;
    }

    setPromoLoading(true);
    const result = await validatePromo(promoCode, subtotal);
    if (result?.success) {
      setAppliedPromo(result.data?.data);
      toast.success(`Promo ${result.data?.data?.code} applied`);
    } else {
      setAppliedPromo(null);
      toast.error(result?.message || "Invalid promo code");
    }
    setPromoLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setPlacingOrder(true);
    setError(null);

    if (paymentMethod === "razorpay") {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setPlacingOrder(false);
        return;
      }
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          street: formData.address,
          apartment: formData.apartment || "",
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
          country: "US", // Defaulting to US for now
        },
        paymentMethod: paymentMethod,
        subtotal: Number(subtotal.toFixed(2)),
        tax: 0,
        shippingCost: Number(shippingCost.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        promoCode: appliedPromo?.code,
        notes: "",
      };

      const result = await createOrder(orderData);

      if (result.success) {
        if (paymentMethod === "razorpay" && result.data?.razorpayOrderId) {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: result.data.amount,
            currency: result.data.currency,
            name: "Tohfabox25",
            description: "Order Payment",
            order_id: result.data.razorpayOrderId,
            handler: async function (response) {
              try {
                const confirmResult = await confirmOrder({
                  orderData: result.data.orderData,
                  razorpayResponse: response
                });
                if (confirmResult.success) {
                  toast.success("Payment successful! Your order is placed.");
                  navigate("/orders");
                } else {
                  toast.error(confirmResult.message || "Failed to confirm order.");
                }
              } catch (err) {
                 toast.error("Error confirming payment.");
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#12343b",
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response){
            toast.error("Payment failed. Please try again.");
          });
          rzp.open();
          setPlacingOrder(false);
          return;
        }

        toast.success("Your order has been placed successfully!");
        navigate("/orders");
      } else {
        setError(result.message || "Failed to place order. Please try again.");
      }
    } catch {
      setError("Something went wrong processing your order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart || loadingUser) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center soft-grid">
        <LogoLoader label="Preparing checkout..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-sm border border-gray-100">
            <ShoppingBagIcon className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-4xl font-serif text-resin-dark mb-4">
            Cart is Empty
          </h2>
          <p className="text-gray-500 mb-10">
            Add items to your cart to proceed to checkout.
          </p>
          <Link
            to="/products"
            className="inline-block bg-resin-dark hover:bg-resin-blue text-white font-bold py-4 px-10 rounded-full tracking-widest uppercase text-sm transition-colors shadow-md"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white/90 border-b border-resin-gold/20 soft-grid">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-row md:flex-row justify-between items-start md:items-center gap-4">
          <div> */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.24em] text-resin-gold">Almost there</p> */}
            <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-resin-dark font-serif flex items-center gap-4">
              Secure Checkout
            </h1>
            <button
              onClick={() => navigate("/cart")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-red-600 transition-all hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-95"
            >
              {/* <ArrowLeftIcon className="w-4 h-4" /> */}
              {/* <TrashIcon className="h-4 w-4" aria-hidden="true" /> */}
              Back to cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <form
          onSubmit={handlePlaceOrder}
          className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
        >
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Contact Information */}
            <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                    required
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                  required
                />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="ZIP / Postal Code"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-resin-blue transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "credit_card"
                      ? "border-resin-blue bg-resin-blue/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-resin-blue"
                  />
                  <CreditCardIcon className="w-8 h-8 text-resin-dark" />
                  <div>
                    <p className="font-bold text-gray-900">
                      Credit / Debit Card
                    </p>
                    <p className="text-sm text-gray-500">
                      Secure transaction via Stripe
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-resin-blue bg-resin-blue/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-resin-blue"
                  />
                  <ShieldCheckIcon className="w-8 h-8 text-resin-dark" />
                  <div>
                    <p className="font-bold text-gray-900">
                      Razorpay (UPI / Cards / NetBanking)
                    </p>
                    <p className="text-sm text-gray-500">
                      Secure payments via Razorpay
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "cash_on_delivery"
                      ? "border-resin-blue bg-resin-blue/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-resin-blue"
                  />
                  <BanknotesIcon className="w-8 h-8 text-resin-dark" />
                  <div>
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map((item) => {
                  const product = item.product;
                  return (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={product.images?.[0]?.url || "/logo.png"}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/logo.png";
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-resin-dark line-clamp-2 text-sm">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-resin-dark">
                        ₹{(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mb-7 rounded-2xl border border-resin-gold/20 bg-resin-light p-4">
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-resin-blue">
                  Have a promo code?
                </label>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    disabled={promoLoading || Boolean(appliedPromo)}
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold tracking-wider text-resin-dark focus:border-resin-blue focus:outline-none focus:ring-2 focus:ring-resin-blue/20"
                  />
                  <button
                    type="button"
                    onClick={
                      appliedPromo
                        ? () => {
                            setAppliedPromo(null);
                            setPromoCode("");
                          }
                        : handleApplyPromo
                    }
                    disabled={promoLoading}
                    aria-busy={promoLoading}
                    className="rounded-xl bg-resin-dark px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-resin-blue disabled:bg-gray-400"
                  >
                    {promoLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                          aria-hidden="true"
                        />
                        Checking
                      </span>
                    ) : appliedPromo ? (
                      "Remove"
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                {appliedPromo && (
                  <p className="mt-2 text-xs font-bold text-green-700">
                    {appliedPromo.code} saved you ₹{discount.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={
                      shippingCost === 0
                        ? "text-green-600 font-bold"
                        : "font-semibold text-gray-900"
                    }
                  >
                    {shippingCost === 0
                      ? "Complimentary"
                      : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-semibold text-green-700">
                    <span>Promo discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-3xl font-bold text-resin-dark">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md flex items-center justify-center gap-3"
              >
                {placingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <div className="relative my-6 flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Order via WhatsApp
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  By placing your order, you agree to our{" "}
                  <span className="underline">Terms of Service</span> and{" "}
                  <span className="underline">Privacy Policy</span>. All
                  transactions are secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
