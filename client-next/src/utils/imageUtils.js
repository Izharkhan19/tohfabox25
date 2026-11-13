// Image optimization and fallback utility for Artistary Crafts (Tohfabox)

export const ARTISAN_PLACEHOLDER = "/logo.png";

export const CRAFT_FALLBACKS = [
  "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&auto=format&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&q=80",
  "https://images.unsplash.com/photo-1531685250784-afb348726f59?w=600&auto=format&q=80",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&q=80",
];

/**
 * Extracts a Google Drive file ID from various Drive URL formats
 */
export function extractGoogleDriveId(url) {
  if (!url || typeof url !== 'string') return null;
  
  // match id=XXXXX
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  
  // match /d/XXXXX
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  
  // match uc?export=view&id=XXXXX
  const ucMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) return ucMatch[1];
  
  return null;
}

/**
 * Optimizes an image URL for mobile delivery:
 * - Compresses Google Drive thumbnails with sz=w600 instead of massive w1000/original
 * - Injects auto-format and WebP quality for Cloudinary
 * - Injects auto-format for Unsplash
 */
export function getOptimizedImageUrl(rawUrl, width = 600) {
  if (!rawUrl || typeof rawUrl !== 'string') return CRAFT_FALLBACKS[0];

  let url = rawUrl.trim();

  // If Google Drive
  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    const fileId = extractGoogleDriveId(url);
    if (fileId) {
      // Use Google Drive's high-speed mobile thumbnail endpoint
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
    }
  }

  // If Cloudinary
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('/f_auto,q_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
  }

  // If Unsplash
  if (url.includes('images.unsplash.com')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?w=${width}&auto=format&q=80`;
  }

  return url;
}

/**
 * Secondary mirror for Google Drive images in case thumbnail CDN throttles
 */
export function getBackupGoogleDriveUrl(url) {
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w600`;
  }
  return null;
}
