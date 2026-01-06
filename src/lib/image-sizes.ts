export interface ImageSizes {
  thumbnail: string;
  medium: string;
  large: string;
  full: string;
  srcset?: string;
}

/**
 * Generuje rôzne veľkosti obrázkov pre featured image
 * V produkcii by to malo používať Next.js Image Optimization API
 */
export function generateImageSizes(imageUrl: string): ImageSizes {
  const baseUrl = imageUrl.startsWith('http') 
    ? new URL(imageUrl).origin + new URL(imageUrl).pathname
    : imageUrl;

  // Pre statické obrázky v public folderi
  if (imageUrl.startsWith('/')) {
    return {
      thumbnail: imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '-150x150.$1'),
      medium: imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '-300x300.$1'),
      large: imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '-768x768.$1'),
      full: imageUrl,
      srcset: `${imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '-150x150.$1')} 150w, ${imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '-300x300.$1')} 300w, ${imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '-768x768.$1')} 768w, ${imageUrl} 1200w`,
    };
  }

  // Pre externé obrázky alebo obrázky bez optimalizácie
  return {
    thumbnail: imageUrl,
    medium: imageUrl,
    large: imageUrl,
    full: imageUrl,
  };
}

/**
 * Vytvorí ImageObject structured data pre obrázok
 */
export function createImageObjectSchema(imageUrl: string, alt: string, width?: number, height?: number) {
  const sizes = generateImageSizes(imageUrl);
  
  return {
    '@type': 'ImageObject',
    url: sizes.full,
    width: width || 1200,
    height: height || 630,
    caption: alt,
    thumbnailUrl: sizes.thumbnail,
    contentUrl: sizes.full,
    encodingFormat: 'image/jpeg',
  };
}

