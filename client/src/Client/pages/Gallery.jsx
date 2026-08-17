import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import SharePlugin from "yet-another-react-lightbox/plugins/share";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { ShareIcon } from "@heroicons/react/24/outline";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  PinterestShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
  PinterestIcon,
} from "react-share";

import { getProducts } from "../../api-services/apiService";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openShareId, setOpenShareId] = useState(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      setLoading(true);
      try {
        const result = await getProducts({ limit: 100 });
        if (result?.success) {
          // Extract all images from all products
          const allImages = [];
          result.data.data.forEach((product) => {
            if (product.images && product.images.length > 0) {
              product.images.forEach((img, index) => {
                allImages.push({
                  src: img.url,
                  alt: `${product.name} - Image ${index + 1}`,
                  productId: product._id,
                  productName: product.name,
                  productPrice: product.price,
                });
              });
            }
          });
          setImages(allImages);
        }
      } catch (error) {
        console.error("Failed to fetch products for gallery", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const baseUrl = currentUrl.split('/gallery')[0] || '';

  const handleShareClick = async (e, img) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = `${baseUrl}/products/${img.productId}`;
    const shareTitle = `Check out this amazing art: ${img.productName}`;

    // Try native share first, but only if it's available (fails on local HTTP network testing)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareTitle,
          url: shareUrl,
        });
        return; // Success, don't open custom menu
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    }
    
    // Fallback: Toggle custom share menu
    setOpenShareId(openShareId === img.productId ? null : img.productId);
  };

  const breakpointColumnsObj = {
    default: 4,
    1024: 3,
    768: 3,
    640: 2,
    0: 2, // Always at least 2 columns on very small screens
  };

  return (
    <>
      {/* Hero Header */}
      <section className="relative bg-[#12343b] py-20 md:py-28 overflow-hidden border-b border-[#c89666]/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&fit=crop')] opacity-10 object-cover mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12343b] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-serif tracking-wide drop-shadow-md">
            Product <span className="text-[#e1b382] italic">Gallery</span>
          </h1>
          <p className="text-base md:text-xl text-[#fdfbf9]/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Immerse yourself in our collection of exquisite, handcrafted masterpieces. Share your favorites with the world.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 bg-[#fdfbf9]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#e1b382]/30 border-t-[#e1b382] rounded-full animate-spin mb-4"></div>
            <p className="text-[#12343b] font-bold animate-pulse">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-black text-[#12343b] mb-3">No images found</p>
            <p className="text-gray-500 font-medium">Check back later for stunning art pieces.</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-3 md:-ml-4"
            columnClassName="pl-3 md:pl-4 bg-clip-padding"
          >
            {images.map((img, idx) => (
              <motion.div
                key={`${img.productId}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 10) * 0.1 }}
                className="mb-3 md:mb-4 relative group rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(45,84,94,0.15)] transition-all cursor-zoom-in"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full block rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                />
                
                {/* Hover Overlay - Better for Mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12343b]/90 via-[#12343b]/10 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 md:p-6" onClick={(e) => {
                    // Let the event bubble up to trigger lightbox
                }}>
                  <div className="flex justify-between items-end">
                    <div className="flex-1">
                      <Link 
                        to={`/products/${img.productId}`} 
                        className="text-white font-black text-sm md:text-xl line-clamp-1 hover:text-[#e1b382] transition-colors mb-0.5 md:mb-1 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {img.productName}
                      </Link>
                      <p className="text-[#e1b382] font-bold text-xs md:text-sm">
                        ₹{Number(img.productPrice).toFixed(2)}
                      </p>
                    </div>

                    {/* Social Share Group */}
                    <div className="flex gap-2 ml-2 md:ml-4" onClick={(e) => e.stopPropagation()}>
                       <div className="group/share relative">
                          <button 
                             onClick={(e) => handleShareClick(e, img)}
                             className="w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#e1b382] hover:text-[#12343b] transition-colors"
                          >
                              <ShareIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          
                          {/* Share Menu Popup */}
                          <div 
                             className={`absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl p-2 flex gap-2 transition-all duration-200 z-50 ${
                               openShareId === img.productId 
                               ? 'opacity-100 visible translate-y-0' 
                               : 'opacity-0 invisible translate-y-2'
                             } md:group-hover/share:opacity-100 md:group-hover/share:visible md:group-hover/share:translate-y-0`}
                             onClick={(e) => e.stopPropagation()}
                          >
                              <WhatsappShareButton url={`${baseUrl}/products/${img.productId}`} title={`Check out this amazing art: ${img.productName}`}>
                                  <WhatsappIcon size={32} round />
                              </WhatsappShareButton>
                              <FacebookShareButton url={`${baseUrl}/products/${img.productId}`} quote={`Check out this amazing art: ${img.productName}`}>
                                  <FacebookIcon size={32} round />
                              </FacebookShareButton>
                              <TwitterShareButton url={`${baseUrl}/products/${img.productId}`} title={`Check out this amazing art: ${img.productName}`}>
                                  <XIcon size={32} round />
                              </TwitterShareButton>
                              <PinterestShareButton url={`${baseUrl}/products/${img.productId}`} media={img.src} description={img.productName}>
                                  <PinterestIcon size={32} round />
                              </PinterestShareButton>
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

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        plugins={[Zoom, Thumbnails, SharePlugin]}
        share={{
          url: ({ slide }) => `${baseUrl}/products/${slide?.productId}`,
          title: ({ slide }) => `Check out this amazing art: ${slide?.productName}`,
        }}
        styles={{
            container: { backgroundColor: "rgba(18, 52, 59, 0.95)" }
        }}
      />
    </>
  );
}
