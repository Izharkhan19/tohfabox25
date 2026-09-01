import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    HeartIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { getProduct, getProductReviews, saveProductReview, addToCart, addToWishlist, removeFromWishlist } from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import LogoLoader from "../../components/LogoLoader";
import { toast } from 'react-toastify';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isLoggedIn = !!localStorage.getItem("token");

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const result = await getProduct(id);
            if (result?.success && result?.data) {
                const p = result.data?.data;
                setProduct({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    description: p.description || "No description available.",
                    images: p.images?.length > 0 ? p.images : [{ url: "https://via.placeholder.com/800" }],
                    rating: p.rating?.average || 0,
                    reviews: p.rating?.count || 0,
                    artist: p.artist || "Master Resin Artist",
                    location: p.location || "Global Artisan Studio",
                    materials: p.materials || "High-Gloss Epoxy Resin, Pigments",
                    dimensions: p.dimensions?.value
                        ? `${p.dimensions.value} ${p.dimensions.unit || "cm"}`
                        : "Custom Dimensions",
                    features: p.tags?.length > 0 ? p.tags : ["Hand-Poured", "Crystal Clear", "Unique Pattern"],
                });
                setIsWishlisted(user?.wishlist?.includes(p._id) || false);
            } else {
                setProduct(null);
            }
        } catch (error) {
            console.error("Error loading product:", error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
            getProductReviews(id).then((result) => {
                if (result?.success && result?.data?.data) {
                    setReviews(result.data.data);
                    const ownReview = result.data.data.find((review) => String(review.user?._id) === String(user?._id));
                    if (ownReview) setSelectedRating(ownReview.rating);
                }
            });
        }
    }, [id]);

    const handleRatingSubmit = async () => {
        if (!isLoggedIn) {
            toast.info("Please sign in to rate this product");
            return;
        }

        if (!selectedRating) {
            toast.info("Please select a rating first");
            return;
        }

        setReviewLoading(true);
        try {
            const result = await saveProductReview(id, { rating: selectedRating });
            if (result?.success) {
                toast.success("Thanks for rating this product!");
                await fetchProduct();
                const updatedReviews = await getProductReviews(id);
                if (updatedReviews?.success && updatedReviews?.data?.data) setReviews(updatedReviews.data.data);
            } else {
                toast.error(result?.message || "Unable to save rating");
            }
        } catch {
            toast.error("Unable to save rating");
        } finally {
            setReviewLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            toast.info("Please sign in to add items to cart");
            return;
        }

        if (cartLoading) return;
        setCartLoading(true);
        try {
            const res = await addToCart(id, quantity);
            if (res?.success) {
                toast.success(`Added ${quantity} × ${product.name} to cart!`);
            }
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setCartLoading(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        const newState = !isWishlisted;
        setIsWishlisted(newState);

        try {
            if (newState) {
                await addToWishlist(id);
            } else {
                await removeFromWishlist(id);
            }
        } catch {
            setIsWishlisted(!newState);
            toast.error("Failed to update wishlist");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-brand-light soft-grid">
                <LogoLoader label="Preparing art piece..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-16 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-4xl font-serif text-gray-800 mb-4">Piece Not Found</h2>
                    <p className="text-gray-500 mb-8">This art piece might have been sold or removed.</p>
                    <Link to="/products" className="bg-resin-dark text-white px-8 py-3 rounded-full hover:bg-resin-blue transition-colors">
                        Return to Gallery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-md border border-gray-100 relative group">
                            <img
                                src={product.images[activeImage]?.url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-resin-blue/5 pointer-events-none"></div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                                            activeImage === i ? "border-resin-blue shadow-md opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <img referrerPolicy="no-referrer" src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-serif leading-tight">
                                    {product.name}
                                </h1>
                                <button
                                    onClick={handleWishlistToggle}
                                    className="p-3 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition-all hover:shadow-md"
                                >
                                    {isWishlisted ? (
                                        <HeartFilledIcon className="w-7 h-7 text-red-500" />
                                    ) : (
                                        <HeartIcon className="w-7 h-7" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-resin-gold">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? "fill-current" : "fill-gray-200"}`} viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        ({product.rating.toFixed(1)} / {reviews.length || product.reviews} reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5">
                                <p className="text-sm font-bold text-gray-700 mb-3">Rate this piece</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center" role="radiogroup" aria-label="Product rating">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => setSelectedRating(rating)}
                                                role="radio"
                                                aria-checked={selectedRating === rating}
                                                aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
                                                className="cursor-pointer p-1 text-resin-gold transition-transform hover:scale-110"
                                            >
                                                <svg className={`w-6 h-6 ${rating <= selectedRating ? "fill-current" : "fill-gray-200"}`} viewBox="0 0 20 20" aria-hidden="true">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRatingSubmit}
                                        disabled={reviewLoading}
                                        className="rounded-full bg-resin-dark px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-resin-blue disabled:bg-gray-400"
                                    >
                                        {reviewLoading ? "Saving..." : "Submit Rating"}
                                    </button>
                                </div>
                                {!isLoggedIn && <p className="mt-2 text-xs text-gray-500">Sign in to submit your rating.</p>}
                            </div>

                            <div className="text-3xl sm:text-4xl font-bold text-resin-dark mb-8">
                                ₹{Number(product.price).toFixed(2)}
                            </div>
                            
                            <p className="text-gray-600 font-light leading-relaxed mb-8">
                                {product.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-10">
                            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-bold">Artisan Details</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Created By</p>
                                    <p className="font-serif font-bold text-resin-dark text-xl">{product.artist}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Studio Location</p>
                                    <p className="font-serif font-bold text-resin-dark text-xl">{product.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Primary Materials</p>
                                    <p className="text-gray-800">{product.materials}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                                    <p className="text-gray-800">{product.dimensions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Actions */}
                        <div className="mb-10">
                            {product.stock === 0 ? (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center font-bold uppercase tracking-widest">
                                    Currently Out of Stock
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden w-full sm:w-auto h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-6 h-full hover:bg-gray-50 transition-colors text-xl text-gray-500"
                                        >−</button>
                                        <span className="w-12 text-center font-bold text-lg text-resin-dark">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-6 h-full hover:bg-gray-50 transition-colors text-xl text-gray-500"
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={cartLoading}
                                        className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold tracking-widest uppercase text-sm h-14 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                                    >
                                        {cartLoading ? "Adding..." : "Add to Cart"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                            <div className="flex flex-col items-center text-center">
                                <SparklesIcon className="w-8 h-8 text-resin-gold mb-3" />
                                <p className="text-xs uppercase tracking-wider font-bold text-gray-800 mb-1">Authentic</p>
                                <p className="text-xs text-gray-500">Handcrafted</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <TruckIcon className="w-8 h-8 text-resin-gold mb-3" />
                                <p className="text-xs uppercase tracking-wider font-bold text-gray-800 mb-1">Shipping</p>
                                <p className="text-xs text-gray-500">Carefully Packed</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <ShieldCheckIcon className="w-8 h-8 text-resin-gold mb-3" />
                                <p className="text-xs uppercase tracking-wider font-bold text-gray-800 mb-1">Secure</p>
                                <p className="text-xs text-gray-500">SSL Encrypted</p>
                            </div>
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