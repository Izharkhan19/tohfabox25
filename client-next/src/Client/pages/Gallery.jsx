"use client";
import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import {
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ShoppingBagIcon,
  XMarkIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  FacebookIcon,
  XIcon,
} from "react-share";

import { getGalleryItems, placeGalleryOrder, getProducts, getCategories } from "../../api-services/apiService";
import LogoLoader from "../../components/LogoLoader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

/* ─────────────────────────────────────────────
   Quick Order Modal
───────────────────────────────────────────── */
function QuickOrderModal({ item, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const total = item.price > 0 ? (Number(item.price) * form.quantity).toFixed(2) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    setSubmitting(true);
    const res = await placeGalleryOrder({
      galleryItemId: item._id,
      name: form.name.trim(),
      phone: form.phone,
      address: form.address.trim(),
      quantity: form.quantity,
      notes: form.notes,
    });

    if (res?.success) {
      setDone(true);
      
      // WhatsApp notification
      const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000000"; // Fallback to a placeholder
      const message = `*New Quick Order from Gallery!*\n\n*Item:* ${item.title}\n*Quantity:* ${form.quantity}\n*Price:* ${item.price > 0 ? '₹' + item.price : 'On Inquiry'}\n\n*Customer Details:*\n*Name:* ${form.name.trim()}\n*Phone:* ${form.phone}\n*Address:* ${form.address.trim() || 'N/A'}\n*Notes:* ${form.notes.trim() || 'None'}`;
      
      window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
      
    } else {
      toast.error(res?.message || "Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-[#c89666] focus:bg-white focus:ring-2 focus:ring-[#c89666]/20";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#12343b]">
            <div className="flex items-center gap-3">
              <ShoppingBagIcon className="w-6 h-6 text-[#e1b382]" />
              <div>
                <p className="text-xs text-[#c89666] font-semibold uppercase tracking-wider">Quick Order</p>
                <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1">
            {done ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircleIcon className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">Order Received! 🎉</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Thank you <span className="font-bold text-gray-700">{form.name}</span>! We've received your order for <strong>"{item.title}"</strong>. Our team will contact you shortly to confirm.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-8 py-3 rounded-full bg-[#12343b] text-white font-bold hover:bg-[#1a4a55] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Product Preview */}
                <div className="flex gap-3 p-3 rounded-2xl bg-[#f9f5f0] border border-[#e1b382]/30">
                  <img
                    src={item.image?.url}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <p className="mt-1 text-base font-extrabold text-[#c89666]">
                      {item.price > 0 ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price on inquiry"}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold text-gray-600">Quantity</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                      className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition text-sm sm:text-lg font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm sm:text-lg font-bold text-gray-800">{form.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, quantity: p.quantity + 1 }))}
                      className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition text-sm sm:text-lg font-bold"
                    >
                      +
                    </button>
                    {total && (
                      <span className="ml-auto text-lg font-black text-[#12343b]">₹{Number(total).toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <label className="block text-xs font-bold text-gray-600">
                  <span className="flex items-center gap-1 mb-1"><UserIcon className="w-3.5 h-3.5" /> Full Name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </label>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-1 mb-1">
                    <PhoneIcon className="w-3.5 h-3.5" /> WhatsApp / Phone *
                  </label>
                  <PhoneInput
                    country="in"
                    value={form.phone}
                    onChange={(phone) => setForm((p) => ({ ...p, phone }))}
                    inputClass="!w-full !rounded-xl !border !border-gray-200 !bg-gray-50 !text-sm !text-gray-800 !py-3 !pl-14"
                    containerClass="!w-full"
                    buttonClass="!rounded-l-xl !border !border-gray-200 !bg-gray-50"
                    inputStyle={{ height: "46px" }}
                  />
                </div>

                {/* Address */}
                <label className="block text-xs font-bold text-gray-600">
                  <span className="flex items-center gap-1 mb-1"><MapPinIcon className="w-3.5 h-3.5" /> Delivery Address</span>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    className={`${inputClass} resize-none`}
                    placeholder="Your delivery address (optional)"
                  />
                </label>

                {/* Notes */}
                <label className="block text-xs font-bold text-gray-600">
                  Additional Notes <span className="font-normal text-gray-400">(optional)</span>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    className={`${inputClass} resize-none`}
                    placeholder="Customization wishes, color preferences..."
                  />
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#12343b] text-white font-bold text-base hover:bg-[#1a4a55] active:scale-[0.98] transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg"
                >
                  {submitting ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <><ShoppingBagIcon className="w-5 h-5" /> Place Order</>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400">
                  By placing this order you agree our team will contact you to confirm details.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Main Gallery Page
───────────────────────────────────────────── */
export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openShareId, setOpenShareId] = useState(null);
  const [viewDetailsItem, setViewDetailsItem] = useState(null);
  const [orderItem, setOrderItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchGalleryAndProducts = async () => {
      setLoading(true);
      try {
        const [galleryRes, productsRes, categoriesRes] = await Promise.all([
          getGalleryItems(),
          getProducts({ limit: 100 }),
          getCategories()
        ]);
        if (categoriesRes?.success) setCategories(categoriesRes.data?.data || []);

        let combinedItems = [];

        // 1. Add Gallery Items
        if (galleryRes?.success) {
          combinedItems = [...(galleryRes.data?.data || [])];
        }

        // 2. Add Product Images (formatted to look like gallery items)
        if (productsRes?.success) {
          const products = productsRes.data?.data || [];
          products.forEach(product => {
            if (product.images && product.images.length > 0) {
              product.images.forEach((img, idx) => {
                // Strip HTML tags from description if present
                const cleanDesc = product.shortDescription || (product.description ? product.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '');
                
                combinedItems.push({
                  _id: `prod_${product._id}_${idx}`,
                  title: product.name,
                  description: cleanDesc,
                  price: product.price,
                  image: { url: img.url },
                  isProductImage: true,
                  category: product.category?._id || product.category
                });
              });
            }
          });
        }

        // Optional: shuffle or sort combined items here
        setItems(combinedItems);
      } catch (error) {
        console.error("Failed to fetch gallery and products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryAndProducts();
  }, []);

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShareClick = async (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = `${currentUrl}/gallery?item=${item._id}`;
    const shareTitle = `Check out this amazing piece: ${item.title}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl });
        return;
      } catch {}
    }
    setOpenShareId(openShareId === item._id ? null : item._id);
  };

    const breakpointCols = { default: 4, 1280: 4, 1024: 3, 768: 3, 640: 2, 0: 2 };

  const filteredItems = items
    .filter((item) =>
      (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === "all" || item.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  const slides = filteredItems.map((item) => ({ src: item.image?.url, alt: item.title }));

  return (
    <>
      {/* Quick Order Modal */}
      {orderItem && <QuickOrderModal item={orderItem} onClose={() => setOrderItem(null)} />}

      {/* Hero Header */}
      <section className="relative bg-[#12343b] py-20 md:py-28 overflow-hidden border-b border-[#c89666]/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&fit=crop')] opacity-10 object-cover mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12343b] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-serif tracking-wide drop-shadow-md">
            Our <span className="text-[#e1b382] italic">Gallery</span>
          </h1>
          <p className="text-base md:text-xl text-[#fdfbf9]/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Browse our handcrafted collection. Click any image to view it in full — or tap{" "}
            <strong className="text-[#e1b382]">"Quick Order"</strong> to place your order instantly.
          </p>
        </div>
      </section>

      
      {/* Sleek Mobile & Desktop Filters Bar */}
      <section className="sticky top-[56px] md:top-[76px] bg-[#fdfbf9]/95 backdrop-blur-xl shadow-md z-30 py-3 md:py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                </select>
            </div>

            {/* Desktop Sort */}
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
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 bg-[#fdfbf9]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LogoLoader label="Loading gallery..." />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-black text-[#12343b] mb-3">Nothing here yet</p>
            <p className="text-gray-500 font-medium">Our gallery is being curated. Check back soon!</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointCols}
            className="flex w-auto -ml-3 md:-ml-4"
            columnClassName="pl-3 md:pl-4 bg-clip-padding"
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 10) * 0.07 }}
                className="mb-3 md:mb-4 relative group rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(45,84,94,0.15)] transition-all"
              >
                {/* Image */}
                <img
                  src={item.image?.url}
                  alt={item.title}
                  className="w-full block rounded-2xl transform group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                  loading="lazy"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                />

                {/* Hover Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#12343b]/95 via-[#12343b]/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 md:p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-1 md:gap-2">
                    <div>
                      <p className="text-white font-black text-[11px] md:text-base line-clamp-2 leading-tight md:leading-snug mb-0.5 md:mb-1">{item.title}</p>
                      <p className="text-[#e1b382] font-bold text-[10px] md:text-sm">
                        {item.price > 0 ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price on inquiry"}
                      </p>
                    </div>

                    <div className="flex gap-1 md:gap-2 mt-0.5 md:mt-1 items-center">
                      {/* Quick Order Button */}
                      <button
                        onClick={() => setOrderItem(item)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 md:py-1.5 px-1.5 md:px-4 rounded-lg md:rounded-xl bg-[#e1b382] text-[#12343b] text-[9px] md:text-xs font-black hover:bg-[#c89666] transition-colors whitespace-nowrap overflow-hidden"
                      >
                        <ShoppingBagIcon className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                        <span className="truncate">Order</span>
                      </button>

                      {/* View Details Button */}
                      <button
                        onClick={() => setViewDetailsItem(item)}
                        className="shrink-0 w-7 h-7 md:w-9 md:h-9 bg-white/15 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-[#12343b] transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>

                      {/* Share Button */}
                      <div className="relative shrink-0">
                        <button
                          onClick={(e) => handleShareClick(e, item)}
                          className="w-7 h-7 md:w-9 md:h-9 bg-white/15 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white hover:bg-[#e1b382] hover:text-[#12343b] transition-colors"
                        >
                          <ShareIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        {/* Share Popup */}
                        <div
                          className={`absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl p-2 flex gap-2 transition-all duration-200 z-50 ${
                            openShareId === item._id
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible translate-y-2"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <WhatsappShareButton url={`${currentUrl}/gallery?item=${item._id}`} title={`Check out: ${item.title}`}>
                            <WhatsappIcon size={30} round />
                          </WhatsappShareButton>
                          <FacebookShareButton url={`${currentUrl}/gallery?item=${item._id}`} quote={item.title}>
                            <FacebookIcon size={30} round />
                          </FacebookShareButton>
                          <TwitterShareButton url={`${currentUrl}/gallery?item=${item._id}`} title={item.title}>
                            <XIcon size={30} round />
                          </TwitterShareButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </section>

      
      {/* View Details Dialog */}
      <Dialog
        visible={!!viewDetailsItem}
        onHide={() => setViewDetailsItem(null)}
        showHeader={false}
        className="w-[95vw] sm:max-w-md rounded-2xl shadow-2xl bg-white overflow-hidden"
        contentClassName="bg-white p-0 relative"
        breakpoints={{ '960px': '75vw', '640px': '95vw' }}
        dismissableMask
        draggable={false}
      >
        {viewDetailsItem && (
          <div className="flex flex-col bg-white max-h-[85vh]">
            <div className="relative shrink-0">
              <img 
                src={viewDetailsItem.image?.url} 
                alt={viewDetailsItem.title} 
                className="w-full h-56 sm:h-64 object-cover"
              />
              <button 
                onClick={() => setViewDetailsItem(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                title="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">{viewDetailsItem.title}</h3>
                <p className="text-[#c89666] font-bold text-lg mb-3">
                  {viewDetailsItem.price > 0 ? `₹${Number(viewDetailsItem.price).toLocaleString("en-IN")}` : "Price on inquiry"}
                </p>
                <div className="text-sm text-gray-600 mb-6 leading-relaxed">
                    <p>{viewDetailsItem.description || "No description available for this masterpiece."}</p>
                </div>
                
                <button 
                  onClick={() => {
                    setOrderItem(viewDetailsItem);
                    setViewDetailsItem(null);
                  }}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 bg-[#12343b] hover:bg-[#1a4b57] text-white font-bold transition-colors shadow-md mt-auto"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  <span>Quick Order</span>
                </button>
            </div>
          </div>
        )}
      </Dialog>

      
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
                  <ul className="space-y-2">
                      <li>
                          <label className="flex items-center justify-between cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                              <span className={`text-base font-bold transition-colors ${selectedCategory === 'all' ? "text-[#2d545e]" : "text-gray-600"}`}>All Masterpieces</span>
                              <div className="relative flex items-center">
                                  <input type="radio" checked={selectedCategory === 'all'} onChange={() => { setSelectedCategory('all'); setIsMobileFiltersOpen(false); }} className="peer sr-only" />
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#2d545e] peer-checked:bg-[#2d545e] transition-all shadow-sm"></div>
                                  <div className="absolute inset-0 rounded-full scale-0 peer-checked:scale-50 bg-[#e1b382] transition-transform"></div>
                              </div>
                          </label>
                      </li>
                      {categories.map(cat => (
                          <li key={cat._id}>
                              <label className="flex items-center justify-between cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                  <span className={`text-base font-bold transition-colors ${selectedCategory === cat._id ? "text-[#2d545e]" : "text-gray-600"}`}>{cat.name}</span>
                                  <div className="relative flex items-center">
                                      <input type="radio" checked={selectedCategory === cat._id} onChange={() => { setSelectedCategory(cat._id); setIsMobileFiltersOpen(false); }} className="peer sr-only" />
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

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        styles={{ container: { backgroundColor: "rgba(18, 52, 59, 0.95)" } }}
      />
    </>
  );
}
