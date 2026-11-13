"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getProducts } from "../../api-services/apiService";

export default function HeaderSearch({ isMobile = false, onCloseMobile }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    let isCurrent = true;
    let timerId = null;

    (async () => {
      await Promise.resolve();
      if (!isCurrent) return;

      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      timerId = setTimeout(async () => {
        try {
          const res = await getProducts({ search: trimmed, limit: 5 });
          if (!isCurrent) return;
          if (res?.success && Array.isArray(res?.data?.data)) {
            setResults(res.data.data);
          } else {
            setResults([]);
          }
        } catch (err) {
          console.error("Header search error:", err);
          if (isCurrent) setResults([]);
        } finally {
          if (isCurrent) setLoading(false);
        }
      }, 250);
    })();

    return () => {
      isCurrent = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [query]);

  // Click outside to dismiss suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    setQuery("");
    if (onCloseMobile) onCloseMobile();
    router.push(`/products/${productId}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search gifts, resin art, crochet..."
          aria-label="Search products"
          className={`w-full bg-black/25 focus:bg-[#0c2429] border border-[#e1b382]/30 focus:border-[#e1b382] rounded-full text-white placeholder-gray-300 shadow-inner focus:outline-none transition-all ${
            isMobile
              ? "pl-9 pr-9 py-1.5 text-xs h-9"
              : "pl-9 pr-9 py-1.5 text-xs md:text-sm h-9"
          }`}
        />
        <button
          type="submit"
          className="absolute left-2.5 text-[#e1b382] hover:text-white transition-colors"
          aria-label="Submit search"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
        </button>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-2.5 p-0.5 text-gray-400 hover:text-white rounded-full transition-colors"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Live Search Suggestions Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0f2b31] border border-[#e1b382]/30 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
          {loading ? (
            <div className="p-3 text-center text-xs text-gray-300 flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-[#e1b382] border-t-transparent rounded-full animate-spin"></span>
              Searching products...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-white/10 max-h-72 overflow-y-auto">
              {results.map((product) => {
                const img = product.images?.[0]?.url || "/logo.png";
                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleSelectProduct(product._id)}
                    className="w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={img}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/logo.png";
                      }}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{product.name}</p>
                      <p className="text-[11px] text-[#e1b382] font-semibold">₹{Number(product.price || 0).toFixed(2)}</p>
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full text-center py-2 px-3 bg-[#e1b382]/10 hover:bg-[#e1b382]/20 text-[#e1b382] text-xs font-bold transition-colors"
              >
                View all results for &quot;{query}&quot; &rarr;
              </button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-gray-300">No products found for &quot;{query}&quot;</p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="inline-block mt-2 text-[11px] text-[#e1b382] hover:underline font-bold"
              >
                Explore all handcrafted pieces &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
