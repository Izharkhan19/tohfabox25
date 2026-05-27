import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    XMarkIcon,
    HeartIcon as HeartOutline,
    SparklesIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import { toast } from 'react-toastify';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const isLoggedIn = !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

    const fetchWishlist = async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getWishlist();
            if (result?.success && Array.isArray(result?.data?.data)) {
                const validItems = result?.data?.data.filter(
                    (item) => item && (item._id || item.id)
                );
                setWishlistItems(validItems);
            } else {
                setWishlistItems([]);
                if (result?.message) setError(result.message);
            }
        } catch (err) {
            setError("Failed to load wishlist");
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [isLoggedIn]);

    const handleRemove = async (productId) => {
        if (!productId) return;

        setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));

        const result = await removeFromWishlist(productId);
        if (!result?.success) {
            toast.error(result?.message || "Failed to remove item");
            fetchWishlist();
        }
    };

    const handleClearAll = async () => {
        if (wishlistItems.length === 0) return;

        if (!confirm("Remove all items from your collection?")) return;

        const result = await clearWishlist();
        if (result?.success) {
            setWishlistItems([]);
        } else {
            toast.error(result?.message || "Failed to clear wishlist");
        }
    };

    const handleAddToCart = async (productId) => {
        if (!productId) return;

        const result = await addToCart(productId, 1);
        if (result?.success) {
            toast.success("Added to cart!");
        } else {
            toast.error(result?.message || "Failed to add to cart");
        }
    };

    const openLoginModal = () => setShowLoginModal(true);

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <HeartSolid className="w-16 h-16 text-resin-blue mx-auto mb-6 animate-pulse" />
                    <p className="text-sm uppercase tracking-widest text-gray-500">Loading Collection...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-[70vh] bg-gray-50 py-20 flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                    <HeartOutline className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-resin-dark mb-4">Sign In to View</h2>
                    <p className="text-gray-500 mb-10">Save your favorite handcrafted treasures and access them from any device.</p>
                    <button
                        onClick={openLoginModal}
                        className="w-full bg-resin-dark hover:bg-resin-blue text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md"
                    >
                        Sign In Now
                    </button>
                </div>
                <WishlistLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-20 px-6">
                <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100 w-full">
                    <HeartSolid className="w-16 h-16 text-red-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-gray-800 mb-4">Oops!</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="w-full bg-resin-dark hover:bg-resin-blue text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] bg-gray-50 py-20 flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-sm border border-gray-100">
                        <SparklesIcon className="w-12 h-12 text-resin-gold" />
                    </div>
                    <h2 className="text-4xl font-serif text-resin-dark mb-4">Collection is Empty</h2>
                    <p className="text-gray-500 mb-10">Save your favorite resin art pieces here to easily find them later.</p>
                    <Link
                        to="/products"
                        className="inline-block bg-resin-dark hover:bg-resin-blue text-white font-bold h-14 px-10 leading-[56px] rounded-full tracking-widest uppercase text-sm transition-all shadow-md"
                    >
                        Explore Gallery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-resin-dark font-serif flex items-center gap-4">
                            My Collection
                            <span className="text-lg font-sans font-normal text-gray-400">
                                ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
                            </span>
                        </h1>
                        <button
                            onClick={handleClearAll}
                            className="text-sm uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors font-bold"
                        >
                            Clear Collection
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-3 space-y-6">
                        {wishlistItems.map((product) => {
                            const id = product._id || product.id;
                            const name = product.name || "Unnamed Product";
                            const price = product.price || 0;
                            const image = product.images?.[0]?.url || "https://via.placeholder.com/400";
                            const stock = product.stock ?? 0;

                            return (
                                <div
                                    key={id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md"
                                >
                                    <Link to={`/products/${id}`} className="w-full sm:w-40 h-40 flex-shrink-0">
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </Link>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div>
                                                <Link
                                                    to={`/products/${id}`}
                                                    className="text-xl font-bold font-serif text-resin-dark hover:text-resin-blue transition-colors line-clamp-2"
                                                >
                                                    {name}
                                                </Link>
                                                <p className="text-sm text-gray-500 mt-1">{product.artist || "Master Artisan"}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-2xl font-bold text-resin-dark">
                                                ₹{Number(price).toFixed(2)}
                                            </span>
                                            {stock === 0 && (
                                                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                            <button
                                                onClick={() => handleAddToCart(id)}
                                                disabled={stock === 0}
                                                className={`w-full py-3 md:py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-md shrink-0 ${stock > 0
                                                    ? "bg-resin-dark hover:bg-resin-blue text-white"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                {stock > 0 ? "Add to Cart" : "Unavailable"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-resin-blue/5 rounded-3xl p-8 sticky top-8 border border-resin-blue/10 text-center">
                            <SparklesIcon className="w-12 h-12 text-resin-gold mx-auto mb-6" />
                            <h2 className="text-2xl font-serif text-resin-dark mb-4">Curated Collection</h2>
                            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                                You have {wishlistItems.length} handcrafted pieces saved. Don't wait too long, as our masterworks are often one-of-a-kind.
                            </p>
                            <Link
                                to="/products"
                                className="block w-full bg-white text-resin-dark border border-gray-200 hover:border-resin-blue hover:text-resin-blue font-bold tracking-widest uppercase text-xs h-12 leading-[46px] rounded-full transition-colors"
                            >
                                Discover More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <WishlistLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
}