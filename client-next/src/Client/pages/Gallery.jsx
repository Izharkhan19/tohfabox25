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

import { getGalleryItems, placeGalleryOrder, getProducts } from "../../api-services/apiService";
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

  useEffect(() => {
    const fetchGalleryAndProducts = async () => {
      setLoading(true);
      try {
        const [galleryRes, productsRes] = await Promise.all([
          getGalleryItems(),
          getProducts({ limit: 100 })
        ]);

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
                  isProductImage: true
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

  const slides = items.map((item) => ({ src: item.image?.url, alt: item.title }));

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

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 bg-[#fdfbf9]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LogoLoader label="Loading gallery..." />
          </div>
        ) : items.length === 0 ? (
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
            {items.map((item, idx) => (
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
                  className="absolute inset-0 bg-gradient-to-t from-[#12343b]/95 via-[#12343b]/20 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 md:p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-white font-black text-sm md:text-base line-clamp-2 leading-snug mb-1">{item.title}</p>
                      <p className="text-[#e1b382] font-bold text-xs md:text-sm">
                        {item.price > 0 ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price on inquiry"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                      {/* Quick Order Button */}
                      <button
                        onClick={() => setOrderItem(item)}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-1.5 px-2 md:px-4 rounded-xl bg-[#e1b382] text-[#12343b] text-[11px] md:text-xs font-black hover:bg-[#c89666] transition-colors whitespace-nowrap"
                      >
                        <ShoppingBagIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span>Quick Order</span>
                      </button>

                      {/* View Details Button */}
                      <button
                        onClick={() => setViewDetailsItem(item)}
                        className="shrink-0 w-8 h-8 md:w-9 md:h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-[#12343b] transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>

                      {/* Share Button */}
                      <div className="relative shrink-0">
                        <button
                          onClick={(e) => handleShareClick(e, item)}
                          className="w-8 h-8 md:w-9 md:h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-[#e1b382] hover:text-[#12343b] transition-colors"
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
        header={viewDetailsItem?.title || "Details"}
        className="w-[95vw] sm:max-w-md rounded-2xl shadow-2xl bg-white"
        contentClassName="bg-white pt-2 pb-4 px-4 sm:px-6"
        headerClassName="bg-white px-4 sm:px-6 py-4 rounded-t-2xl border-b border-gray-100"
        breakpoints={{ '960px': '75vw', '640px': '95vw' }}
        dismissableMask
        draggable={false}
      >
        {viewDetailsItem && (
          <div className="flex flex-col gap-4 bg-white">
            <img 
              src={viewDetailsItem.image?.url} 
              alt={viewDetailsItem.title} 
              className="w-full h-64 object-cover rounded-xl shadow-sm"
            />
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{viewDetailsItem.title}</h3>
                <p className="text-[#c89666] font-bold text-lg mb-3">
                  {viewDetailsItem.price > 0 ? `₹${Number(viewDetailsItem.price).toLocaleString("en-IN")}` : "Price on inquiry"}
                </p>
                <div className="prose prose-sm text-gray-600">
                    <p>{viewDetailsItem.description || "No description available for this masterpiece."}</p>
                </div>
            </div>
            
            <div className="mt-2 flex gap-3 pt-4 border-t border-gray-100">
              <Button 
                label="Close" 
                outlined 
                onClick={() => setViewDetailsItem(null)} 
                className="flex-1 py-3 justify-center" 
              />
              <Button 
                label="Quick Order" 
                icon="pi pi-shopping-bag" 
                onClick={() => {
                  setOrderItem(viewDetailsItem);
                  setViewDetailsItem(null);
                }}
                className="flex-1 py-3 justify-center bg-[#12343b] hover:bg-[#1a4b57] border-none text-white" 
              />
            </div>
          </div>
        )}
      </Dialog>

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
