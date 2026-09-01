import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const cachedCartItems = useAppStore((state) => state.cartItems);
  const fetchSharedCart = useAppStore((state) => state.fetchCart);

  const isLoggedIn =
    !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

  const fetchCart = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = cachedCartItems
        ? { success: true, data: { data: cachedCartItems } }
        : await fetchSharedCart();

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
      setError("Failed to load your cart. Please try again.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
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
            Discover unique resin art pieces to add to your collection.
          </p>
          <Link
            to="/products"
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
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 md:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex min-w-0 flex-nowrap items-center gap-2 text-2xl font-bold text-resin-dark font-serif sm:gap-3 sm:text-3xl md:gap-4 md:text-4xl">
              <span className="truncate">Your Cart</span>
              <span className="shrink-0 rounded-full bg-resin-gold/10 px-2.5 py-1 text-xs font-sans font-semibold text-resin-blue sm:px-3 sm:text-sm md:text-lg">
                ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
              </span>
            </h1>
            <button
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-red-600 transition-all hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-95"
            >
              {/* <TrashIcon className="h-4 w-4" aria-hidden="true" /> */}
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => {
              const product = item.product;
              const inStock = product?.stock > 0;

              return (
                <div
                  key={item._id || product._id}
                  className={`bg-white rounded-2xl shadow-sm border border-resin-gold/15 p-4 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 transition-opacity ${!inStock ? "opacity-60" : ""}`}
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="w-full sm:w-32 h-32 flex-shrink-0"
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

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          to={`/products/${product._id}`}
                          className="text-xl font-bold font-serif text-resin-dark hover:text-resin-blue transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.artist || "Artisan"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {!inStock && (
                      <p className="text-xs text-red-500 font-bold uppercase tracking-wider mt-2">
                        Out of Stock
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                      <div className="flex items-center border border-gray-200 rounded-full h-10 w-32 bg-gray-50">
                        <button
                          onClick={() =>
                            updateQuantity(product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || !inStock}
                          className="px-3 h-full hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-l-full text-gray-600"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="flex-1 text-center font-bold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product._id, item.quantity + 1)
                          }
                          disabled={!inStock}
                          className="px-3 h-full hover:bg-gray-100 disabled:opacity-50 transition-colors rounded-r-full text-gray-600"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-resin-dark">
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{product.price.toFixed(2)} each
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
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-lg font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

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

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-3xl font-bold text-resin-dark">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  Taxes calculated at checkout
                </p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-resin-dark hover:bg-resin-blue text-white font-bold tracking-widest uppercase text-sm h-14 rounded-full transition-all shadow-md transform hover:-translate-y-0.5 mb-6"
              >
                Secure Checkout
              </button>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-resin-gold" />
                  <span>Secure, encrypted payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 text-resin-gold" />
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
