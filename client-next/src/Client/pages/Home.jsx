"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
  getCategories
} from "../../api-services/apiService";
import { useAppStore } from "../../stores/useAppStore";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import LogoLoader from "../../components/LogoLoader";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const defaultOccasionsList = [
  { _id: "anniversary", name: "Anniversary", image: { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80" } },
  { _id: "baby-shower", name: "Baby Shower", image: { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80" } },
  { _id: "birthday", name: "Birthday", image: { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80" } },
  { _id: "diwali", name: "Diwali", image: { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" } }
];

const defaultRelationshipsList = [
  { _id: "boyfriend", name: "Boyfriend", image: { url: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=500&q=80" } },
  { _id: "brother", name: "Brother", image: { url: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=500&q=80" } },
  { _id: "girlfriend", name: "Girlfriend", image: { url: "https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=500&q=80" } },
  { _id: "family", name: "Family", image: { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80" } }
];

const containerVariants = {
  hidden: { opacity: 0.8 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0.8, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dbOccasions, setDbOccasions] = useState(defaultOccasionsList);
  const [dbRelationships, setDbRelationships] = useState(defaultRelationshipsList);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [cartLoading, setCartLoading] = useState({});
  const [localCartCounts, setLocalCartCounts] = useState({});
  const cachedFeaturedProducts = useAppStore((state) => state.featuredProducts);
  const cachedCartItems = useAppStore((state) => state.cartItems);
  const cachedCategories = useAppStore((state) => state.categories);
  const fetchFeaturedProductsFromStore = useAppStore((state) => state.fetchFeaturedProducts);
  const fetchCategoriesFromStore = useAppStore((state) => state.fetchCategories);
  const fetchCart = useAppStore((state) => state.fetchCart);

  const cartCounts = useMemo(() => {
    const base = {};
    if (Array.isArray(cachedCartItems)) {
      cachedCartItems.forEach((item) => {
        const productId = item.product?._id || item.product;
        base[productId] = item.quantity || 0;
      });
    }
    return { ...base, ...localCartCounts };
  }, [cachedCartItems, localCartCounts]);

  const storedUser = (typeof window !== 'undefined' ? localStorage.getItem("user") : null);
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!(typeof window !== 'undefined' ? localStorage.getItem("token") : null);

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
    //     subtitle: "Beautiful crochet clocks, frames, and hampers crafted with love.",
    //     cta: "View Custom Art",
    //     link: "/products?category=crochet"
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
    { name: "Crochet Decor", icon: ClockIcon },
    { name: "Photo Frames", icon: PhotoIcon },
    { name: "Gift Hampers", icon: GiftIcon },
    { name: "Custom Art", icon: SparklesIcon },
  ];

  // Fallback images for dynamic categories if they don't have images
  const defaultOccasionImages = [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80"
  ];

  const defaultRelationshipImages = [
    "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=500&q=80",
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=500&q=80",
    "https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=500&q=80",
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80"
  ];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await Promise.resolve();
      if (!isMounted) return;
      // Parallelize categories and featured products fetching using store caching & deduplication
      Promise.allSettled([
        fetchCategoriesFromStore(),
        fetchFeaturedProductsFromStore(),
      ]);
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchCategoriesFromStore, fetchFeaturedProductsFromStore]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await Promise.resolve();
      if (!isMounted) return;
      if (Array.isArray(cachedCategories) && cachedCategories.length > 0) {
        const occs = cachedCategories.filter(c => c.type === 'Occasion');
        const rels = cachedCategories.filter(c => c.type === 'Relationship');
        if (occs.length > 0) setDbOccasions(occs);
        if (rels.length > 0) setDbRelationships(rels);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [cachedCategories]);

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
    if (isLoggedIn && !cachedCartItems) {
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
          setLocalCartCounts((prev) => ({ ...prev, [productId]: cartItem?.quantity || (prev[productId] || 0) + 1 }));
        } else {
          setLocalCartCounts((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
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
      <section className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[640px] flex items-center overflow-hidden bg-brand-dark">
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                        <div className="max-w-2xl text-left animate-fade-in-up pt-4 sm:pt-8 md:pt-12">
                            <p className="text-[#e1b382] uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm font-black mb-2 sm:mb-4">Handmade pieces for meaningful spaces</p>
                            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mb-2 sm:mb-4 leading-tight drop-shadow-xl font-serif">
                                {slide.title}
                            </h1>
                            <p className="text-xs sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-xl font-medium leading-snug drop-shadow-md line-clamp-2 sm:line-clamp-none">
                                {slide.subtitle}
                            </p>
                            <Link
                                href={slide.link}
                                className="inline-flex items-center gap-2 bg-brand-secondary hover:bg-white text-brand-dark font-black py-2.5 px-6 sm:py-3.5 sm:px-8 rounded-full text-xs sm:text-sm md:text-base uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg"
                            >
                                {slide.cta}
                                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {/* Slider Navigation */}
        <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-0 right-0 z-20 flex justify-center gap-2 sm:gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full shadow-md ${
                i === currentSlide
                  ? "bg-brand-secondary w-7 sm:w-12 h-2 sm:h-3"
                  : "bg-white/60 hover:bg-white w-2 sm:w-3 h-2 sm:h-3"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-3 sm:py-6 md:py-8 bg-transparent -mt-5 sm:-mt-8 md:-mt-12 relative z-20 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-[#fdfbf9] rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(45,84,94,0.1)] border border-brand-accent/20 p-3 sm:p-6 md:p-8 grid grid-cols-4 gap-2 sm:gap-4 md:flex md:justify-around"
            >
                {categories.map((cat, i) => (
                    <motion.div variants={itemVariants} key={i}>
                        <Link href="/products" className="flex flex-col items-center gap-1.5 sm:gap-3 group">
                            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} transitionSpeed={1000} className="w-12 h-12 sm:w-16 sm:h-16 md:w-22 md:h-22 rounded-full flex items-center justify-center bg-brand-dark text-brand-secondary shadow-[0_0_15px_rgba(225,179,130,0.25)] border sm:border-2 border-brand-accent/30 group-hover:scale-105 transition-all duration-300">
                                <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                            </Tilt>
                            <span className="font-extrabold text-[10px] sm:text-xs md:text-base text-brand-dark group-hover:text-brand-primary transition-colors tracking-tight text-center line-clamp-1">{cat.name}</span>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-6 sm:py-12 md:py-16 bg-brand-light">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
              <div className="flex justify-between items-end mb-4 sm:mb-8">
                  <div>
                      <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-brand-dark font-serif">Shop by Occasion</h2>
                      <p className="text-xs sm:text-base md:text-lg text-brand-muted font-medium mt-0.5">Find the perfect gift for their special day.</p>
                  </div>
                  <Link href="/products" className="flex items-center gap-1 text-brand-primary font-bold text-xs sm:text-base hover:text-brand-dark transition-colors shrink-0">
                      View All <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-2" />
                  </Link>
              </div>
              <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "250px" }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-8"
              >
                  {dbOccasions.length > 0 ? dbOccasions.map((occ, i) => (
                      <motion.div variants={itemVariants} key={occ._id}>
                          <Link href={`/products?occasion=${occ._id}`} className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md aspect-square block">
                              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000} className="w-full h-full">
                                  <img referrerPolicy="no-referrer" src={occ.image?.url || defaultOccasionImages[i % defaultOccasionImages.length]} alt={occ.name} loading={i < 2 ? "eager" : "lazy"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/25 to-transparent"></div>
                                  <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-4 md:p-6 text-center sm:text-left">
                                      <h3 className="text-brand-secondary font-black text-xs sm:text-lg md:text-2xl tracking-tight drop-shadow-md truncate">{occ.name}</h3>
                                  </div>
                              </Tilt>
                          </Link>
                      </motion.div>
                  )) : (
                      <div className="col-span-full text-center text-gray-500 py-6 text-sm font-medium">No occasions defined yet.</div>
                  )}
              </motion.div>
          </div>
      </section>

      {/* Gifts by Relationship */}
      <section className="py-6 sm:py-12 md:py-16 bg-[#fdfbf9]">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
              <div className="text-center mb-4 sm:mb-8 md:mb-12">
                  <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-brand-dark mb-1 font-serif">Gifts by Relationship</h2>
                  <p className="text-xs sm:text-base md:text-lg text-brand-muted font-medium">Curated selections for the ones you love.</p>
              </div>
              <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "250px" }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10"
              >
                  {dbRelationships.length > 0 ? dbRelationships.map((rel, i) => (
                      <motion.div variants={itemVariants} key={rel._id}>
                          <Link href={`/products?relationship=${rel._id}`} className="group flex flex-col items-center gap-2 sm:gap-4">
                              <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} transitionSpeed={1000} className="w-24 h-24 sm:w-36 sm:h-36 md:w-52 md:h-52 rounded-full overflow-hidden shadow-md border-4 sm:border-6 md:border-8 border-white group-hover:border-brand-primary transition-colors">
                                  <img referrerPolicy="no-referrer" src={rel.image?.url || defaultRelationshipImages[i % defaultRelationshipImages.length]} alt={rel.name} loading={i < 2 ? "eager" : "lazy"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </Tilt>
                              <h3 className="font-black text-brand-dark text-xs sm:text-base md:text-xl group-hover:text-brand-primary transition-colors tracking-tight text-center truncate max-w-full">{rel.name}</h3>
                          </Link>
                      </motion.div>
                  )) : (
                      <div className="col-span-full text-center text-gray-500 py-6 text-sm font-medium">No relationships defined yet.</div>
                  )}
              </motion.div>
          </div>
      </section>

      {/* Trending Products */}
      <section className="py-6 sm:py-12 md:py-16 bg-brand-light relative">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative z-10">
          <div className="flex justify-between items-end mb-4 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-brand-dark font-serif">
                Trending Gifts
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-brand-muted font-medium mt-0.5">
                Our most loved personalized creations.
              </p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-brand-primary font-bold text-xs sm:text-base hover:text-brand-dark transition-colors shrink-0">
                View All <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LogoLoader label="Curating your collection..." compact />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-brand-accent/20">
              <p className="text-base sm:text-xl text-brand-muted font-medium">
                No trending products available at the moment.
              </p>
            </div>
          ) : (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "250px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-8"
            >
              {featuredProducts.slice(0,4).map((product) => (
                <motion.div variants={itemVariants} key={product.id}>
                    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.12} glarePosition="all">
                        <div
                        className="group relative bg-[#fdfbf9] rounded-2xl sm:rounded-3xl shadow-[0_4px_15px_rgba(45,84,94,0.06)] hover:shadow-[0_15px_30px_rgba(45,84,94,0.15)] transition-all duration-300 overflow-hidden border border-brand-accent/20 flex flex-col h-full"
                        >
                        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                            <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Badge */}
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand-accent text-brand-dark text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
                                Best Seller
                            </div>
                        </Link>

                        <button
                            onClick={(e) => { e.preventDefault(); handleWishlistClick(product.id); }}
                            disabled={wishlistLoading[product.id]}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-full shadow-md hover:bg-brand-light transition-colors disabled:opacity-50"
                        >
                            {wishlistLoading[product.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-brand-primary" />
                            ) : product.isWishlisted ? (
                            <HeartSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            ) : (
                            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-muted hover:text-red-500 transition-colors" />
                            )}
                        </button>

                        <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1">
                            <Link href={`/products/${product.id}`}>
                            <h3 className="text-xs sm:text-base md:text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">
                                {product.name}
                            </h3>
                            </Link>
                            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                            <div className="flex text-brand-secondary">
                                {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.round(product.rating) ? "fill-current" : "fill-gray-300"}`} viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                                ))}
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold text-brand-muted">
                                ({product.rating.toFixed(1)})
                            </span>
                            </div>
                            <div className="mt-auto flex justify-between items-center pt-2 sm:pt-3 border-t border-brand-accent/20 gap-1">
                            <span className="text-xs sm:text-base md:text-xl font-extrabold text-brand-dark">
                                ₹{Number(product.price).toFixed(2)}
                            </span>
                            <button
                                onClick={() => handleAddToCart(product.id, product.name)}
                                disabled={cartLoading[product.id]}
                                aria-label={`Add ${product.name} to cart`}
                                className="relative text-brand-primary hover:text-brand-dark hover:bg-brand-secondary bg-brand-primary/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors disabled:opacity-50"
                            >
                                {cartCounts[product.id] > 0 && (
                                    <span className="absolute -right-1.5 -top-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md" aria-label={`${cartCounts[product.id]} in cart`}>
                                    {cartCounts[product.id]}
                                    </span>
                                )}
                                {cartLoading[product.id] ? (
                                    <span className="block h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-brand-primary/30 border-t-brand-primary" aria-hidden="true" />
                                ) : (
                                    <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
                                )}
                            </button>
                            </div>
                        </div>
                        </div>
                    </Tilt>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 sm:py-10 md:py-16 bg-[#fdfbf9] border-t border-brand-accent/30 mb-4 md:mb-0">
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "250px" }}
            className="max-w-7xl mx-auto px-3.5 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-10"
        >
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
            <motion.div variants={itemVariants} key={i} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left group bg-white/60 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-brand-accent/10 shadow-sm sm:shadow-none">
              <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} className="p-2.5 sm:p-4 bg-brand-primary/10 text-brand-primary rounded-xl sm:rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 stroke-2" />
              </Tilt>
              <div>
                  <h3 className="font-black text-xs sm:text-base md:text-xl text-brand-dark mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-brand-muted font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
