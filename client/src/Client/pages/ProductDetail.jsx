import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    HeartIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    SparklesIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { getProduct, getProductReviews, saveProductReview, addToCart, addToWishlist, removeFromWishlist } from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import LogoLoader from "../../components/LogoLoader";
import { toast } from 'react-toastify';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isLoggedIn = !!localStorage.getItem("token");

    const fetchProduct = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const result = await getProduct(id);
            if (result?.success && result?.data) {
                const p = result.data?.data;
                setProduct({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    description: p.description || "",
                    images: p.images?.length > 0 ? p.images : [{ url: "https://via.placeholder.com/800" }],
                    rating: p.rating?.average || 0,
                    reviews: p.rating?.count || 0,
                    category: p.category?.name || "Uncategorized",
                    weight: p.weight?.value ? `${p.weight.value} ${p.weight.unit}` : "N/A",
                    dimensions: p.dimensions?.length ? `${p.dimensions.length} x ${p.dimensions.width} x ${p.dimensions.height} ${p.dimensions.unit}` : "N/A",
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
                await fetchProduct(false);
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
        <div className="bg-gray-100 pb-28 lg:pb-20 pt-0 lg:pt-8 min-h-screen relative">
            {/* Mobile Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="lg:hidden absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center border border-gray-100 text-gray-700 hover:bg-white transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="max-w-7xl mx-auto px-0 lg:px-6">
                <div className="grid lg:grid-cols-2 gap-0 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-2 min-w-0 w-full bg-white pb-4 lg:pb-0 lg:bg-transparent">
                        <div className="aspect-square md:aspect-[4/5] lg:rounded-3xl overflow-hidden bg-white shadow-sm lg:border lg:border-gray-100 relative group">
                            <img
                                src={product.images[activeImage]?.url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-resin-blue/5 pointer-events-none"></div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto px-4 lg:px-0 pb-2 pt-2 scrollbar-hide w-full">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-xl lg:rounded-2xl overflow-hidden border-2 transition-all ${
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
                    <div className="flex flex-col min-w-0">
                        {/* Title & Price Card */}
                        <div className="bg-white p-4 lg:p-0 lg:bg-transparent mb-2 lg:mb-8 shadow-sm lg:shadow-none">
                            <div className="flex justify-between items-start mb-2 gap-4">
                                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-serif leading-tight break-words">
                                    {product.name}
                                </h1>
                                <button
                                    onClick={handleWishlistToggle}
                                    className="p-2 lg:p-3 bg-gray-50 lg:bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition-all hover:shadow-md"
                                >
                                    {isWishlisted ? (
                                        <HeartFilledIcon className="w-6 h-6 lg:w-7 lg:h-7 text-red-500" />
                                    ) : (
                                        <HeartIcon className="w-6 h-6 lg:w-7 lg:h-7" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                    <span className="text-sm font-bold text-green-700">{product.rating.toFixed(1)}</span>
                                    <div className="flex text-green-600">
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500 underline decoration-dotted cursor-pointer">
                                    {reviews.length || product.reviews} ratings
                                </span>
                            </div>

                            <div className="text-3xl sm:text-4xl font-bold text-resin-dark mb-1">
                                ₹{Number(product.price).toFixed(2)}
                            </div>
                            <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-widest">Inclusive of all taxes</p>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white p-4 lg:p-0 lg:bg-transparent mb-2 lg:mb-8 shadow-sm lg:shadow-none">
                            <h3 className="text-sm lg:hidden font-bold text-gray-800 mb-2 uppercase tracking-wide">Product Details</h3>
                            {product.description ? (
                                <div className={`relative ${!isDescExpanded ? 'max-h-32 overflow-hidden' : ''}`}>
                                    <div 
                                        className="text-sm lg:text-base text-gray-600 font-light leading-relaxed prose prose-sm max-w-none break-words"
                                        dangerouslySetInnerHTML={{ __html: product.description.replace(/&nbsp;/g, ' ') }}
                                    />
                                    {!isDescExpanded && (
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-sm">No description available.</p>
                            )}
                            {product.description && product.description.length > 150 && (
                                <button 
                                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                                    className="text-resin-blue font-semibold text-sm mt-2 hover:underline focus:outline-none"
                                >
                                    {isDescExpanded ? "Read Less" : "Read More"}
                                </button>
                            )}
                        </div>

                        {/* Rating Card */}
                        <div className="bg-white p-4 lg:p-5 lg:rounded-2xl border-y lg:border border-gray-100 mb-2 lg:mb-8 shadow-sm lg:shadow-none">
                            <p className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide lg:tracking-normal lg:capitalize">Rate this piece</p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                                            <svg className={`w-7 h-7 lg:w-6 lg:h-6 ${rating <= selectedRating ? "fill-current" : "fill-gray-200"}`} viewBox="0 0 20 20" aria-hidden="true">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRatingSubmit}
                                    disabled={reviewLoading}
                                    className="w-full sm:w-auto rounded-full bg-resin-dark px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-resin-blue disabled:bg-gray-400"
                                >
                                    {reviewLoading ? "Saving..." : "Submit Rating"}
                                </button>
                            </div>
                            {!isLoggedIn && <p className="mt-3 text-xs text-gray-500">Sign in to submit your rating.</p>}
                        </div>

                        {/* Product Specifications Card */}
                        <div className="bg-white p-4 lg:p-8 lg:rounded-3xl border-y lg:border border-gray-100 shadow-sm lg:shadow-sm mb-2 lg:mb-10">
                            <h3 className="text-sm lg:text-xs uppercase tracking-widest text-gray-800 lg:text-gray-400 mb-4 lg:mb-6 font-bold">Product Specifications</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 lg:gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Category</p>
                                    <p className="font-serif font-bold text-resin-dark text-lg lg:text-xl">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Availability</p>
                                    <p className={`font-serif font-bold text-lg lg:text-xl ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                                    <p className="text-sm lg:text-base text-gray-800">{product.weight}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Dimensions (L x W x H)</p>
                                    <p className="text-sm lg:text-base text-gray-800">{product.dimensions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white lg:bg-transparent p-6 lg:p-0 lg:pt-8 lg:border-t border-gray-200 grid grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-0">
                            <div className="flex flex-col items-center text-center">
                                <SparklesIcon className="w-6 h-6 lg:w-8 lg:h-8 text-resin-gold mb-2 lg:mb-3" />
                                <p className="text-[10px] lg:text-xs uppercase tracking-wider font-bold text-gray-800 mb-0.5">Authentic</p>
                                <p className="text-[10px] lg:text-xs text-gray-500 hidden lg:block">Handcrafted</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <TruckIcon className="w-6 h-6 lg:w-8 lg:h-8 text-resin-gold mb-2 lg:mb-3" />
                                <p className="text-[10px] lg:text-xs uppercase tracking-wider font-bold text-gray-800 mb-0.5">Shipping</p>
                                <p className="text-[10px] lg:text-xs text-gray-500 hidden lg:block">Carefully Packed</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <ShieldCheckIcon className="w-6 h-6 lg:w-8 lg:h-8 text-resin-gold mb-2 lg:mb-3" />
                                <p className="text-[10px] lg:text-xs uppercase tracking-wider font-bold text-gray-800 mb-0.5">Secure</p>
                                <p className="text-[10px] lg:text-xs text-gray-500 hidden lg:block">SSL Encrypted</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar for Mobile & Desktop Action */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:p-0 lg:static lg:bg-transparent lg:border-none lg:mt-6 z-50 lg:z-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:shadow-none">
                <div className="max-w-7xl mx-auto lg:px-6">
                    <div className="flex justify-end lg:justify-start">
                        {product.stock === 0 ? (
                            <div className="w-full lg:w-auto bg-red-50 border border-red-100 text-red-600 p-4 lg:p-6 rounded-xl lg:rounded-2xl text-center font-bold uppercase tracking-widest text-sm">
                                Currently Out of Stock
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl lg:rounded-full overflow-hidden h-12 lg:h-14">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 lg:px-6 h-full hover:bg-gray-100 transition-colors text-lg text-gray-500"
                                    >−</button>
                                    <span className="w-8 lg:w-12 text-center font-bold text-base lg:text-lg text-resin-dark">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 lg:px-6 h-full hover:bg-gray-100 transition-colors text-lg text-gray-500"
                                    >+</button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                    className="flex-1 lg:flex-none lg:px-12 bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold tracking-widest uppercase text-sm h-12 lg:h-14 rounded-xl lg:rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {cartLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "Add to Cart"
                                    )}
                                </button>
                            </div>
                        )}
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