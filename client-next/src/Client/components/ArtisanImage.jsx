"use client";
import { useState } from "react";
import {
  getOptimizedImageUrl,
  getBackupGoogleDriveUrl,
  CRAFT_FALLBACKS,
} from "../../utils/imageUtils";

export default function ArtisanImage({
  src,
  alt = "Artisan Craft",
  className = "w-full h-full object-cover",
  aspectRatio = "aspect-[4/5]",
  onClick,
  fallbackIndex = 0,
}) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [currentSrc, setCurrentSrc] = useState(() => getOptimizedImageUrl(src, 600));
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryStage, setRetryStage] = useState(0); // 0 = primary, 1 = backup CDN, 2 = fallback craft, 3 = logo

  // Adjust state during render when prop changes (React recommended pattern)
  if (prevSrc !== src) {
    setPrevSrc(src);
    setCurrentSrc(getOptimizedImageUrl(src, 600));
    setIsLoaded(false);
    setRetryStage(0);
  }

  const handleError = () => {
    if (retryStage === 0) {
      const backup = getBackupGoogleDriveUrl(src);
      if (backup && backup !== currentSrc) {
        setRetryStage(1);
        setCurrentSrc(backup);
        return;
      }
    }

    if (retryStage <= 1) {
      setRetryStage(2);
      const fallback = CRAFT_FALLBACKS[Math.abs(fallbackIndex) % CRAFT_FALLBACKS.length];
      setCurrentSrc(fallback);
      return;
    }

    // Ultimate fallback is local static logo so an image NEVER shows broken in UI
    if (retryStage === 2) {
      setRetryStage(3);
      setCurrentSrc("/logo.png");
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${aspectRatio} overflow-hidden bg-stone-100 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-200/60 to-stone-100 animate-pulse" />
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
