import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import {
  getProducts,
  getCategories,
  addToWishlist,
  removeFromWishlist,
} from "../../api-services/apiService";
import WishlistLoginModal from "../Modals/WishlistLoginModal";
import { toast } from 'react-toastify';
import LogoLoader from "../../components/LogoLoader";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const result = await getCategories();

    if (result?.success) {
      setCategories([
        { _id: "all", name: "All Masterpieces" },
        ...(Array.isArray(result?.data?.data) ? result.data.data : []),
      ]);
    } else {
      setCategories([{ _id: "all", name: "All Masterpieces" }]);
    }
    setLoadingCategories(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const filters = {
      search: searchTerm || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      sort:
        sortBy === "featured"
          ? "-createdAt"
          : sortBy === "price-low"
          ? "price"
          : sortBy === "price-high"
          ? "-price"
          : sortBy === "name"
          ? "name"
          : "-rating",
      limit: 50,
    };

    const result = await getProducts(filters);
    if (result?.success) {
      const transformed = result?.data?.data?.map((p) => ({
        ...p,
        isWishlisted: user?.wishlist?.includes(p._id) || false,
      }));
      setProducts(transformed);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const product = products.find((p) => p._id === productId);
    const isCurrentlyWishlisted = product?.isWishlisted;

    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, isWishlisted: !isCurrentlyWishlisted } : p
      )
    );

    try {
      if (isCurrentlyWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        let updatedWishlist = [...(user.wishlist || [])];

        if (isCurrentlyWishlisted) {
          updatedWishlist = updatedWishlist.filter((id) => id !== productId);
        } else {
          if (!updatedWishlist.includes(productId)) {
            updatedWishlist.push(productId);
          }
        }
        user.wishlist = updatedWishlist;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, isWishlisted: isCurrentlyWishlisted }
            : p
        )
      );
      toast.error("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <>
      {/* Premium Hero Header */}
      <section className="relative bg-[#12343b] py-20 md:py-28 overflow-hidden border-b border-[#c89666]/30 soft-grid">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?w=1920&fit=crop')] opacity-10 object-cover mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12343b] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <p className="text-[#e1b382] uppercase tracking-[0.28em] text-xs md:text-sm font-black mb-5">Made slowly. Chosen thoughtfully.</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 font-serif tracking-wide drop-shadow-md">
            The <span className="text-[#e1b382] italic">Collection</span>
          </h1>
          <p className="text-base md:text-xl text-[#fdfbf9]/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Explore our curated gallery of exquisite resin art and personalized gifts, handcrafted to perfection.
          </p>
        </div>
      </section>

      {/* Sleek Mobile & Desktop Filters Bar */}
      <section className="sticky top-[56px] md:top-[76px] bg-[#fdfbf9]/95 backdrop-blur-xl shadow-md z-30 py-3 md:py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Mobile Layout: Search full width, then buttons side-by-side */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96 group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2d545e] transition-colors" />
              <input
                type="text"
                placeholder="Search art pieces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d545e]/50 focus:border-[#2d545e] transition-all text-sm font-medium text-[#12343b] placeholder-gray-400"
              />
            </div>

            {/* Mobile Actions Grid */}
            <div className="grid grid-cols-2 md:hidden w-full gap-2">
               <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[#12343b] font-bold text-xs shadow-sm active:scale-95 transition-transform"
               >
                 <FunnelIcon className="w-4 h-4 text-[#e1b382]" /> Categories
               </button>
               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[#12343b] font-bold text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d545e]/50 appearance-none text-center"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                  <option value="rating">Highest Rated</option>
                </select>
            </div>

            {/* Desktop Sort & View Toggle */}
            <div className="hidden md:flex justify-end gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-[#12343b] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d545e]/50 cursor-pointer transition-all"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#2d545e] text-white shadow"
                      : "text-gray-500 hover:text-[#2d545e]"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    viewMode === "list"
                      ? "bg-[#2d545e] text-white shadow"
                      : "text-gray-500 hover:text-[#2d545e]"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 bg-[#fdfbf9]">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(45,84,94,0.08)] border border-[#c89666]/20 p-6 sticky top-36">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#12343b] uppercase tracking-wider">
                <FunnelIcon className="w-5 h-5 text-[#e1b382]" />
                Categories
              </h3>

              {loadingCategories ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-5 bg-gray-100 rounded-full animate-pulse" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-4">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="radio"
                            name="category_desktop"
                            checked={selectedCategory === cat._id}
                            onChange={() => setSelectedCategory(cat._id)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#2d545e] peer-checked:bg-[#2d545e] transition-all shadow-sm"></div>
                          <div className="absolute inset-0 rounded-full scale-0 peer-checked:scale-50 bg-[#e1b382] transition-transform"></div>
                        </div>
                        <span className={`text-sm transition-colors font-medium ${
                            selectedCategory === cat._id ? "font-bold text-[#2d545e]" : "text-gray-600 group-hover:text-[#12343b]"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Mobile Filter Slide-Up Modal */}
          {isMobileFiltersOpen && (
              <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
                  <div className="fixed inset-0 bg-[#12343b]/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileFiltersOpen(false)}></div>
                  <div className="bg-white w-full rounded-t-3xl p-6 relative z-10 animate-slide-in-up max-h-[80vh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-black text-xl text-[#12343b]">Select Category</h3>
                          <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                              <XMarkIcon className="w-6 h-6" />
                          </button>
                      </div>
                      <ul className="space-y-5">
                          {categories.map((cat) => (
                            <li key={cat._id}>
                              <label className="flex items-center justify-between cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                <span className={`text-base font-bold transition-colors ${
                                    selectedCategory === cat._id ? "text-[#2d545e]" : "text-gray-600"
                                  }`}
                                >
                                  {cat.name}
                                </span>
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="category_mobile"
                                    checked={selectedCategory === cat._id}
                                    onChange={() => {
                                        setSelectedCategory(cat._id);
                                        setIsMobileFiltersOpen(false);
                                    }}
                                    className="peer sr-only"
                                  />
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#2d545e] peer-checked:bg-[#2d545e] transition-all shadow-sm"></div>
                                  <div className="absolute inset-0 rounded-full scale-0 peer-checked:scale-50 bg-[#e1b382] transition-transform"></div>
                                </div>
                              </label>
                            </li>
                          ))}
                      </ul>
                  </div>
              </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <LogoLoader label="Loading collection..." />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#c89666]/20 shadow-[0_4px_20px_rgba(45,84,94,0.05)]">
                <p className="text-2xl font-black text-[#12343b] mb-3">No masterpieces found</p>
                <p className="text-gray-500 font-medium mb-8">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortBy("featured");
                  }}
                  className="text-[#12343b] font-bold bg-[#e1b382] hover:bg-[#c89666] px-8 py-3 rounded-full transition-colors shadow-lg active:scale-95"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-4 md:gap-8`}
              >
                {products.map((product) => (
                  <motion.div variants={itemVariants} key={product._id} className="h-full">
                      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.01} transitionSpeed={1000} className="h-full">
                          <div
                            className={`h-full group bg-white rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(45,84,94,0.15)] transition-all duration-300 overflow-hidden border border-[#c89666]/20 flex ${viewMode === 'list' ? 'flex-row h-48 md:h-64' : 'flex-col'}`}
                          >
                            <Link to={`/products/${product._id}`} className={`block overflow-hidden relative bg-gray-100 ${viewMode === 'list' ? 'w-2/5 md:w-1/3' : 'w-full aspect-square'}`}>
                              <img referrerPolicy="no-referrer"
                                src={
                                  product.images?.[0]?.url ||
                                  "https://via.placeholder.com/600"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              {!product.stock && (
                                <div className="absolute inset-0 bg-[#12343b]/70 backdrop-blur-sm flex items-center justify-center z-20">
                                  <span className="bg-white/10 text-white border border-white/30 px-4 md:px-6 py-2 rounded-full font-black tracking-widest uppercase text-xs md:text-sm shadow-lg">
                                    Sold Out
                                  </span>
                                </div>
                              )}
                            </Link>

                            <div className={`p-3 md:p-6 flex flex-col justify-between flex-1 relative ${viewMode === 'list' ? 'justify-center' : ''}`}>
                              <button
                                onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                                className={`absolute z-20 p-2 md:p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all active:scale-90 ${viewMode === 'list' ? 'top-4 right-4' : '-top-5 md:-top-6 right-3 md:right-4'}`}
                              >
                                {product.isWishlisted ? (
                                  <HeartSolidIcon className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                                ) : (
                                  <HeartIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-red-500" />
                                )}
                              </button>

                              <div>
                                  <Link to={`/products/${product._id}`}>
                                    <h3 className="text-xs md:text-xl font-black text-[#12343b] mb-1 md:mb-2 group-hover:text-[#2d545e] transition-colors line-clamp-2 leading-tight">
                                      {product.name}
                                    </h3>
                                  </Link>

                                  <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
                                    <div className="flex text-[#e1b382]">
                                      {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < Math.round(product.rating?.average || 0) ? "fill-current" : "fill-gray-200"}`} viewBox="0 0 20 20">
                                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-gray-500">
                                      ({product.rating?.average?.toFixed(1) || "0.0"})
                                    </span>
                                  </div>
                                  
                                  {viewMode === 'list' && (
                                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2 md:line-clamp-3 mb-2 md:mb-4 font-medium hidden sm:block">
                                          {product.description}
                                      </p>
                                  )}
                              </div>

                              <div className="mt-auto pt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <span className="text-base md:text-2xl font-black text-[#12343b]">
                                  ₹{Number(product.price).toFixed(2)}
                                </span>
                                <Link
                                  to={`/products/${product._id}`}
                                  className="w-full md:w-auto text-center bg-[#2d545e]/10 text-[#2d545e] hover:bg-[#2d545e] hover:text-white px-3 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black tracking-widest uppercase transition-colors shrink-0"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                      </Tilt>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <WishlistLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
