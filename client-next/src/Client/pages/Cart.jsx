"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  updateCartItem,
  removeFromCart,
  clearCart,
  createWhatsAppOrder,
  getCurrentUser,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import LogoLoader from "../../components/LogoLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAppStore } from "../../stores/useAppStore";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const cachedCartItems = useAppStore((state) => state.cartItems);
  const fetchSharedCart = useAppStore((state) => state.fetchCart);

  const isLoggedIn =
    !!(typeof window !== 'undefined' ? localStorage.getItem("token") : null) || !!(typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null);

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      if (!cachedCartItems) {
        setLoading(true);
      }
      setError(null);

      try {
        const result = cachedCartItems
          ? { success: true, data: { data: cachedCartItems } }
          : await fetchSharedCart();

        if (!isMounted) return;

        if (result?.success && Array.isArray(result?.data?.data)) {
          const validItems = result?.data?.data.filter(
            (item) => item && item.product && (item._id || item.product._id),
          );
          setCartItems(validItems);
        } else {
          setCartItems([]);
          if (result?.message) setError(result.message);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
        if (isMounted) {
          setError("Failed to load your cart. Please try again.");
          setCartItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, cachedCartItems, fetchSharedCart]);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        (item.product._id || item.product.id) === productId
          ? { ...item, quantity: newQty }
          : item,
      ),
    );

    const result = await updateCartItem(productId, newQty);
    if (!result?.success) {
      toast.error(result?.message || "Failed to update quantity");
      fetchCart();
    }
  };

  const removeItem = async (productId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => (item.product._id || item.product.id) !== productId,
      ),
    );

    const result = await removeFromCart(productId);
    if (!result?.success) {
      toast.error(result?.message || "Failed to remove item");
      fetchCart();
    }
  };

  const clearAll = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear your entire cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#12343b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    });

    if (!result.isConfirmed) return;

    const apiResult = await clearCart();
    if (apiResult?.success) {
      setCartItems([]);
    } else {
      toast.error(apiResult?.message || "Failed to clear cart");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 12.9;
  const total = subtotal + shipping;

  const [waOrdering, setWaOrdering] = useState(false);

  const handleWhatsAppOrder = async () => {
    if (cartItems.length === 0 || waOrdering) return;

    setWaOrdering(true);
    try {
      let customerName = "";
      let customerPhone = "";
      let customerEmail = "";
      let userAddress = {};

      if (isLoggedIn) {
        const userRes = await getCurrentUser();
        if (userRes?.success && userRes.data) {
          customerName = userRes.data.name || "";
          customerPhone = userRes.data.phone || "";
          customerEmail = userRes.data.email || "";
          userAddress = userRes.data.address || {};
        }
      }

      if (!customerName.trim() || !customerPhone.trim()) {
        const { value: formValues, isConfirmed } = await Swal.fire({
          title: "Quick Contact Details",
          html:
            `<input id="swal-wa-name" class="swal2-input" placeholder="Your Full Name" value="${customerName}">` +
            `<input id="swal-wa-phone" class="swal2-input" placeholder="WhatsApp / Phone Number" value="${customerPhone}">`,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonColor: "#25D366",
          confirmButtonText: "Continue to WhatsApp",
          preConfirm: () => {
            const name = document.getElementById("swal-wa-name")?.value?.trim();
            const phone = document.getElementById("swal-wa-phone")?.value?.trim();
            if (!name || !phone) {
              Swal.showValidationMessage("Please enter both your name and phone number");
              return false;
            }
            return { name, phone };
          },
        });

        if (!isConfirmed || !formValues) return;
        customerName = formValues.name;
        customerPhone = formValues.phone;
      }

      const result = await createWhatsAppOrder({
        items: cartItems.map((item) => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity || 1,
        })),
        shippingAddress: {
          fullName: customerName,
          phone: customerPhone,
          street: userAddress.street || "",
          apartment: userAddress.apartment || "",
          city: userAddress.city || "",
          state: userAddress.state || "",
          zipCode: userAddress.zipCode || "",
          country: userAddress.country || "India",
        },
        guestCustomer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
        },
        shippingCost: Number(shipping.toFixed(2)),
        orderSource: "whatsapp",
        paymentMethod: "whatsapp",
      });

      if (!result?.success) {
        toast.error(result?.message || "Failed to record WhatsApp order");
        return;
      }

      const savedOrder = result.data?.data || result.data;
      const orderNumber = savedOrder?.orderNumber;

      const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917737510030"; // Fallback number
      let message = "Hello! I would like to place an order for the following items:\n\n";
      if (orderNumber) {
        message += `*Order ID:* ${orderNumber}\n\n`;
      }

      cartItems.forEach((item, index) => {
        const product = item.product;
        message += `${index + 1}. *${product.name}* (x${item.quantity}) - ₹${(product.price * item.quantity).toFixed(2)}\n`;
      });

      message += `\n*Subtotal:* ₹${subtotal.toFixed(2)}`;
      if (shipping > 0) {
        message += `\n*Shipping:* ₹${shipping.toFixed(2)}`;
      }
      message += `\n*Total Amount:* ₹${total.toFixed(2)}\n\n`;
      message += `*Customer:* ${customerName} (${customerPhone})\n\n`;
      message += `Please guide me with the UPI / Cash on Delivery (COD) payment options.`;

      toast.success("Order recorded! Opening WhatsApp...");
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    } finally {
      setWaOrdering(false);
    }
  };

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-brand-light soft-grid">
        <LogoLoader label="Loading cart..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
          <LockClosedIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-resin-dark mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-500 mb-8">
            Please sign in to view and manage your cart.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full bg-resin-dark hover:bg-resin-blue text-white font-bold py-4 rounded-full tracking-widest uppercase text-sm transition-colors"
          >
            Sign In
          </button>
        </div>
        <WishlistLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
          <ShieldCheckIcon className="w-16 h-16 text-red-300 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={fetchCart}
            className="w-full bg-resin-dark hover:bg-resin-blue text-white font-bold py-4 rounded-full tracking-widest uppercase text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-sm border border-gray-100">
            <ShoppingBagIcon className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-4xl font-serif text-resin-dark mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-10">
            Discover unique crochet art pieces to add to your collection.
          </p>
          <Link
            href="/products"
            className="inline-block bg-resin-dark hover:bg-resin-blue text-white font-bold py-4 px-10 rounded-full tracking-widest uppercase text-sm transition-colors shadow-md"
          >
            Explore Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white/90 border-b border-resin-gold/20 soft-grid">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex min-w-0 flex-nowrap items-center gap-2 text-xl font-bold text-resin-dark font-serif sm:gap-3 sm:text-3xl md:gap-4 md:text-4xl">
              <span className="truncate">Your Cart</span>
              <span className="shrink-0 rounded-full bg-resin-gold/10 px-2.5 py-0.5 text-xs font-sans font-semibold text-resin-blue sm:px-3 sm:py-1 sm:text-sm md:text-lg">
                ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
              </span>
            </h1>
            <button
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-red-600 transition-all hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-95 self-start sm:self-auto"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-12">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 md:space-y-6">
            {cartItems.map((item) => {
              const product = item.product;
              const inStock = product?.stock > 0;

              return (
                <div
                  key={item._id || product._id}
                  className={`bg-white rounded-2xl shadow-sm border border-resin-gold/15 p-3 sm:p-5 md:p-6 flex flex-row gap-3 sm:gap-5 md:gap-6 transition-opacity ${!inStock ? "opacity-60" : ""}`}
                >
                  <Link
                    href={`/products/${product._id}`}
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0"
                  >
                    <img
                      src={product.images?.[0]?.url || "/logo.png"}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/logo.png";
                      }}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${product._id}`}
                          className="text-sm sm:text-lg md:text-xl font-bold font-serif text-resin-dark hover:text-resin-blue transition-colors line-clamp-1 sm:line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                          {product.artist || "Artisan"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(product._id)}
                        className="p-1 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                      >
                        <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {!inStock && (
                      <p className="text-[10px] sm:text-xs text-red-500 font-bold uppercase tracking-wider mt-1">
                        Out of Stock
                      </p>
                    )}

                    <div className="flex flex-row items-center justify-between gap-2 mt-2 sm:mt-4">
                      <div className="flex items-center border border-gray-200 rounded-full h-8 sm:h-9 md:h-10 w-24 sm:w-28 md:w-32 bg-gray-50">
                        <button
                          onClick={() =>
                            updateQuantity(product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || !inStock}
                          className="px-2.5 sm:px-3 h-full hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-l-full text-gray-600 text-xs sm:text-sm"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="flex-1 text-center font-bold text-xs sm:text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product._id, item.quantity + 1)
                          }
                          disabled={!inStock}
                          className="px-2.5 sm:px-3 h-full hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-r-full text-gray-600 text-xs sm:text-sm"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-base sm:text-xl md:text-2xl font-bold text-resin-dark">
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            ₹{product.price.toFixed(2)} ea
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 sticky top-24">
              <h2 className="text-base sm:text-lg font-bold font-serif text-resin-dark mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-sm">
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
                      shipping === 0
                        ? "text-green-600 font-bold"
                        : "font-semibold text-gray-900"
                    }
                  >
                    {shipping === 0
                      ? "Complimentary"
                      : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-5 sm:mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-resin-dark">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-1 text-right">
                  Taxes calculated at checkout
                </p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-resin-dark hover:bg-resin-blue text-white font-bold tracking-wider uppercase text-xs sm:text-sm h-12 sm:h-14 rounded-xl sm:rounded-full transition-all shadow-md active:scale-95 mb-3 sm:mb-4"
              >
                Secure Checkout
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold tracking-wider uppercase text-xs sm:text-sm h-12 sm:h-14 rounded-xl sm:rounded-full transition-all shadow-md active:scale-95 mb-4 sm:mb-6 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Order via WhatsApp
              </button>

              <div className="space-y-3 pt-4 sm:pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                  <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-resin-gold shrink-0" />
                  <span>Secure, encrypted payment processing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                  <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-resin-gold shrink-0" />
                  <span>Complimentary shipping on orders over ₹100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
