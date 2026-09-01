import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  GiftIcon,
  ClockIcon,
  PhotoIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
  addToWishlist,
  removeFromWishlist,
  addToCart,
} from "../../api-services/apiService";
import { useAppStore } from "../../stores/useAppStore";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import LogoLoader from "../../components/LogoLoader";
import { toast } from 'react-toastify';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [cartLoading, setCartLoading] = useState({});
  const [cartCounts, setCartCounts] = useState({});
  const cachedFeaturedProducts = useAppStore((state) => state.featuredProducts);
  const cachedCartItems = useAppStore((state) => state.cartItems);
  const fetchFeaturedProductsFromStore = useAppStore((state) => state.fetchFeaturedProducts);
  const fetchCart = useAppStore((state) => state.fetchCart);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  // Modern Gifting Hero Images
  const heroSlides = [
    {
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80",
        title: "Gifts that speak louder than words",
        subtitle: "Make every moment unforgettable with our curated collection of personalized gifts.",
        cta: "Shop Best Sellers",
        link: "/products"
    },
    {
        image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=1920&q=80",
        title: "Celebrate Their Special Day",
        subtitle: "Discover unique birthday gifts designed to bring a smile to their face.",
        cta: "Explore Birthdays",
        link: "/products?category=birthday"
    },
    // {
    //     image: "https://images.unsplash.com/photo-1584305574600-0cc9ebac3fc9?w=1920&q=80",
    //     title: "Timeless Custom Art",
    //     subtitle: "Beautiful resin clocks, frames, and hampers crafted with love.",
    //     cta: "View Custom Art",
    //     link: "/products?category=resin"
    // },
    {
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80",
        title: "Capture the Memories",
        subtitle: "Elegant photo frames for your most cherished moments.",
        cta: "Shop Frames",
        link: "/products?category=frames"
    },
    // {
    //     image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1920&q=80",
    //     title: "Luxury Hampers",
    //     subtitle: "The perfect corporate or wedding gift hampers.",
    //     cta: "Discover Hampers",
    //     link: "/products?category=hampers"
    // }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { name: "Resin Clocks", icon: ClockIcon },
    { name: "Photo Frames", icon: PhotoIcon },
    { name: "Gift Hampers", icon: GiftIcon },
    { name: "Custom Art", icon: SparklesIcon },
  ];

  const occasions = [
    { name: "Birthdays", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80" },
    { name: "Anniversaries", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80" },
    { name: "Weddings", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80" },
    { name: "Housewarming", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" },
  ];

  const relationships = [
    { name: "For Him", image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=500&q=80" },
    { name: "For Her", image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=500&q=80" },
    { name: "For Couples", image: "https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=500&q=80" },
    { name: "For Parents", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80" },
  ];

  // Fallback product images
  const productImages = [
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
    "https://images.unsplash.com/photo-1531685250784-afb348726f59?w=800",
  ];

  const transformProduct = (product) => {
    const index = featuredProducts.findIndex((p) => p.id === product._id);
    const placeholderImage = productImages[index % productImages.length] || productImages[0];

    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0].url || product.images[0].secure_url
        : placeholderImage;

    const ratingValue = product.rating?.average ?? 4.5;

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      rating: ratingValue,
      image: imageUrl,
      isWishlisted: user?.wishlist?.includes(product._id) || false,
    };
  };

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    if (cachedFeaturedProducts) {
      setFeaturedProducts(cachedFeaturedProducts.map(transformProduct));
      setLoading(false);
      return;
    }
    const resData = await fetchFeaturedProductsFromStore();
    setFeaturedProducts(resData?.success ? (resData.data?.data || []).map(transformProduct) : []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchFeaturedProducts, 0);
    return () => clearTimeout(timer);
  }, [cachedFeaturedProducts, fetchFeaturedProductsFromStore]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (cachedCartItems) {
        setCartCounts(Object.fromEntries(cachedCartItems.map((item) => {
          const productId = item.product?._id || item.product;
          return [productId, item.quantity || 0];
        })));
    } else {
      fetchCart();
    }
  }, [isLoggedIn, cachedCartItems, fetchCart]);

  const handleWishlistClick = async (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const product = featuredProducts.find((p) => p.id === productId);
    const newWishlistedState = !product.isWishlisted;

    setFeaturedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isWishlisted: newWishlistedState } : p
      )
    );

    setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      if (newWishlistedState) {
        await addToWishlist(productId);
        toast.success("Added to wishlist!");
      } else {
        await removeFromWishlist(productId);
        toast.info("Removed from wishlist.");
      }

      const updatedUser = { ...user };
      if (newWishlistedState) {
        if (!updatedUser.wishlist.includes(productId)) {
          updatedUser.wishlist.push(productId);
        }
      } else {
        updatedUser.wishlist = updatedUser.wishlist.filter(
          (id) => id !== productId
        );
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
        toast.error("Failed to update wishlist.");
      setFeaturedProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isWishlisted: !newWishlistedState } : p
        )
      );
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (productId, productName) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (cartLoading[productId]) return;
    setCartLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const result = await addToCart(productId, 1);
      if (result?.success) {
        const updatedCart = result.data?.data;
        if (Array.isArray(updatedCart)) {
          const cartItem = updatedCart.find((item) => String(item.product?._id || item.product) === String(productId));
          setCartCounts((prev) => ({ ...prev, [productId]: cartItem?.quantity || (prev[productId] || 0) + 1 }));
        } else {
          setCartCounts((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
        }
        toast.success(`Added ${productName} to cart!`);
      } else toast.error(result?.message || "Failed to add to cart");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="bg-brand-light">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[620px] md:min-h-[680px] flex items-center overflow-hidden bg-brand-dark">
        {heroSlides.map((slide, index) => (
            <div 
                key={index} 
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                <img referrerPolicy="no-referrer"
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#071d22]/95 via-[#12343b]/65 to-transparent" />
                
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 w-full">
                        <div className="max-w-2xl text-left animate-fade-in-up pt-12">
                            <p className="text-[#e1b382] uppercase tracking-[0.28em] text-xs md:text-sm font-black mb-5">Handmade pieces for meaningful spaces</p>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[0.98] drop-shadow-xl font-serif">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl font-medium leading-relaxed drop-shadow-md">
                                {slide.subtitle}
                            </p>
                            <Link
                                to={slide.link}
                                className="inline-flex items-center gap-3 bg-brand-secondary hover:bg-white text-brand-dark font-black py-4 px-9 rounded-full text-base uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-[0_15px_30px_rgba(0,0,0,0.3)] opacity-100"
                            >
                                {slide.cta}
                                <ChevronRightIcon className="w-6 h-6 stroke-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {/* Slider Navigation */}
        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center gap-4">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full shadow-md ${
                i === currentSlide
                  ? "bg-brand-secondary w-12 h-3"
                  : "bg-white/60 hover:bg-white w-3 h-3"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 bg-transparent -mt-12 relative z-20 px-4 md:px-0">
        <div className="max-w-6xl mx-auto">
            <div className="bg-[#fdfbf9] rounded-3xl shadow-[0_10px_40px_rgba(45,84,94,0.15)] border border-brand-accent/20 p-8 md:p-10 flex flex-wrap md:flex-nowrap justify-around gap-8">
                {categories.map((cat, i) => (
                    <Link to="/products" key={i} className="flex flex-col items-center gap-4 group">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-brand-dark text-brand-secondary shadow-[0_0_20px_rgba(225,179,130,0.3)] border-2 border-brand-accent/30 group-hover:scale-110 transition-all duration-300">
                            <cat.icon className="w-10 h-10 md:w-12 md:h-12" />
                        </div>
                        <span className="font-extrabold text-lg md:text-xl text-brand-dark group-hover:text-brand-primary transition-colors tracking-wide">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-20 bg-brand-light">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                  <div className="mb-4 md:mb-0">
                          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-dark mb-3 font-serif">Shop by Occasion</h2>
                      <p className="text-lg md:text-xl text-brand-muted font-medium">Find the perfect gift for their special day.</p>
                  </div>
                  <Link to="/products" className="flex items-center gap-2 text-brand-primary font-black text-lg hover:text-brand-dark transition-colors">
                      View All <ChevronRightIcon className="w-5 h-5 stroke-2" />
                  </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {occasions.map((occ, i) => (
                      <Link to="/products" key={i} className="group relative rounded-3xl overflow-hidden shadow-lg aspect-square">
                          <img referrerPolicy="no-referrer" src={occ.image} alt={occ.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                              <h3 className="text-brand-secondary font-black text-2xl md:text-3xl tracking-wide drop-shadow-md">{occ.name}</h3>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* Gifts by Relationship */}
      <section className="py-20 bg-[#fdfbf9]">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-dark mb-4 font-serif">Gifts by Relationship</h2>
                  <p className="text-lg md:text-xl text-brand-muted font-medium">Curated selections for the ones you love.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {relationships.map((rel, i) => (
                      <Link to="/products" key={i} className="group flex flex-col items-center gap-6">
                          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-[0_15px_30px_rgba(45,84,94,0.2)] border-8 border-[#fdfbf9] group-hover:border-brand-primary transition-colors">
                              <img referrerPolicy="no-referrer" src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <h3 className="font-black text-brand-dark text-xl md:text-2xl group-hover:text-brand-primary transition-colors tracking-wide">{rel.name}</h3>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 bg-brand-light relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-dark mb-3 font-serif">
                Trending Gifts
              </h2>
              <p className="text-lg md:text-xl text-brand-muted font-medium">
                Our most loved personalized creations.
              </p>
            </div>
            <Link to="/products" className="flex items-center gap-2 text-brand-primary font-black text-lg hover:text-brand-dark transition-colors">
                View All <ChevronRightIcon className="w-5 h-5 stroke-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LogoLoader label="Curating your collection..." />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-brand-accent/20">
              <p className="text-2xl text-brand-muted font-medium">
                No trending products available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0,4).map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-[#fdfbf9] rounded-3xl shadow-[0_4px_20px_rgba(45,84,94,0.08)] hover:shadow-[0_20px_40px_rgba(45,84,94,0.2)] transition-all duration-300 overflow-hidden border border-brand-accent/20 flex flex-col"
                >
                  <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-brand-accent text-brand-dark text-sm font-black px-4 py-1.5 rounded-full shadow-lg">
                        Best Seller
                    </div>
                  </Link>

                  <button
                    onClick={(e) => { e.preventDefault(); handleWishlistClick(product.id); }}
                    disabled={wishlistLoading[product.id]}
                    className="absolute top-4 right-4 z-20 bg-white p-3 rounded-full shadow-lg hover:bg-brand-light transition-colors disabled:opacity-50"
                  >
                    {wishlistLoading[product.id] ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-brand-primary" />
                    ) : product.isWishlisted ? (
                      <HeartSolid className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-brand-muted hover:text-red-500 transition-colors" />
                    )}
                  </button>

                  <div className="p-6 flex flex-col flex-1">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-2 group-hover:text-brand-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-brand-secondary">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? "fill-current" : "fill-gray-300"}`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-brand-muted">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className="mt-auto flex justify-between items-center pt-4 md:pt-6 border-t border-brand-accent/20 flex-wrap gap-2">
                      <span className="text-lg md:text-3xl font-black text-brand-dark">
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={cartLoading[product.id]}
                        aria-label={`Add ${product.name} to cart`}
                        className="relative text-brand-primary hover:text-brand-dark hover:bg-brand-secondary bg-brand-primary/10 p-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                          {cartCounts[product.id] > 0 && (
                            <span className="absolute -right-2 -top-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md" aria-label={`${cartCounts[product.id]} in cart`}>
                              {cartCounts[product.id]}
                            </span>
                          )}
                          {cartLoading[product.id] ? (
                            <span className="block h-5 w-5 md:h-6 md:w-6 animate-spin rounded-full border-2 border-brand-primary/30 border-t-brand-primary" aria-hidden="true" />
                          ) : (
                            <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6 stroke-2" />
                          )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-[#fdfbf9] border-t border-brand-accent/30 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            {
              icon: SparklesIcon,
              title: "Handcrafted",
              desc: "Made with absolute love",
            },
            {
              icon: ShieldCheckIcon,
              title: "Secure Payment",
              desc: "100% Safe Checkout",
            },
            {
              icon: TruckIcon,
              title: "Fast Delivery",
              desc: "Reliable across country",
            },
            {
              icon: GiftIcon,
              title: "Perfect Gifts",
              desc: "Unforgettable memories",
            },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left group">
              <div className="p-5 bg-brand-primary/10 text-brand-primary rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <feature.icon className="w-10 h-10 stroke-2" />
              </div>
              <div>
                  <h3 className="font-black text-xl text-brand-dark mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-base text-brand-muted font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
