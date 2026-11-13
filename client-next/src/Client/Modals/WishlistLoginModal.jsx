"use client";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function WishlistLoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden border border-[#e1b382]/30 flex flex-col z-10 animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Section (Sticky) */}
        <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-4 bg-[#fcfaf7] border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartSolidIcon className="w-5 h-5 text-rose-500" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#12343b]">
              Save to Wishlist
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-95 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body Section (Centered & Readable) */}
        <div className="p-5 sm:p-6 text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 mb-2">
            <HeartSolidIcon className="w-7 h-7 text-rose-500" />
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">
            Sign in to save this handcrafted piece and seamlessly sync your favorite items across all your devices.
          </p>
        </div>

        {/* Footer Section (Sticky) */}
        <div className="shrink-0 p-4 sm:px-6 sm:pb-6 bg-white border-t border-stone-100 flex flex-col gap-2.5">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/30 font-semibold text-xs sm:text-sm text-center transition active:scale-[0.98] shadow-sm flex items-center justify-center"
          >
            Sign In to Continue
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs sm:text-sm text-center transition active:scale-[0.98] flex items-center justify-center"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
