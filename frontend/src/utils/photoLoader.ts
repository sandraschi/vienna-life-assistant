/**
 * Photo Loader Utility - Local User-Curated Photos
 *
 * USER CONTROL OVER VIENNA ATTRACTION PHOTOS
 * ==========================================
 * - No more wrong photos (Colosseum instead of St. Stephen's)
 * - No more generic images (random cafés instead of Café Central)
 * - You control exactly what Vienna landmarks are shown
 * - High-quality, personally selected images of actual attractions
 *
 * HOW TO ADD YOUR OWN PHOTOS:
 * ===========================
 * 1. Place photos in: frontend/public/assets/photos/
 * 2. Use exact filenames: stephansdom.jpg, belvedere.jpg, etc.
 * 3. Photos should be of actual Vienna attractions you want to showcase
 * 4. Recommended: 1200x800px or higher resolution, JPG or PNG format
 * 5. If local photos don't exist, falls back to placeholder images
 */

export interface PhotoConfig {
  id: string;
  alt: string;
  category: 'cathedral' | 'palace' | 'museum' | 'coffee' | 'market' | 'restaurant' | 'park' | 'aquarium' | 'general';
  searchTerm: string; // For documentation - what to search on Unsplash
  verified: boolean; // Whether this image has been manually verified
}

// LOCAL USER-PROVIDED PHOTOS FOR VIENNA ATTRACTIONS
// Photos should be placed in frontend/public/assets/photos/ with these filenames
export const VIENNA_PHOTOS: Record<string, PhotoConfig> = {
  stephansdom: {
    id: '/assets/photos/stephansdom.jpg',
    alt: "St. Stephen's Cathedral Vienna - Iconic Gothic Cathedral",
    category: 'cathedral',
    searchTerm: "Place your photo of St. Stephen's Cathedral in Vienna here",
    verified: false // User must provide this photo
  },
  belvedere: {
    id: '/assets/photos/belvedere.jpg',
    alt: "Belvedere Palace Vienna - Baroque Masterpiece",
    category: 'palace',
    searchTerm: "Place your photo of Belvedere Palace in Vienna here",
    verified: false // User must provide this photo
  },
  hofburg: {
    id: '/assets/photos/hofburg.jpg',
    alt: "Hofburg Imperial Palace Vienna - Habsburg Residence",
    category: 'palace',
    searchTerm: "Place your photo of Hofburg Palace in Vienna here",
    verified: false // User must provide this photo
  },
  schonbrunn: {
    id: '/assets/photos/schonbrunn.jpg',
    alt: "Schönbrunn Palace Vienna - Summer Residence",
    category: 'palace',
    searchTerm: "Place your photo of Schönbrunn Palace in Vienna here",
    verified: false // User must provide this photo
  },
  prater: {
    id: '/assets/photos/prater.jpg',
    alt: "Prater Park Vienna - Giant Ferris Wheel",
    category: 'park',
    searchTerm: "Place your photo of Prater Park/Ferris Wheel in Vienna here",
    verified: false // User must provide this photo
  },
  naschmarkt: {
    id: '/assets/photos/naschmarkt.jpg',
    alt: "Naschmarkt Vienna - Famous Food Market",
    category: 'market',
    searchTerm: "Place your photo of Naschmarkt in Vienna here",
    verified: false // User must provide this photo
  },
  cafe_central: {
    id: '/assets/photos/cafe_central.jpg',
    alt: "Café Central Vienna - Historic Coffee House",
    category: 'coffee',
    searchTerm: "Place your photo of Café Central in Vienna here",
    verified: false // User must provide this photo
  },
  khm: {
    id: '/assets/photos/khm.jpg',
    alt: "Kunsthistorisches Museum Vienna - Art History Museum",
    category: 'museum',
    searchTerm: "Place your photo of Kunsthistorisches Museum in Vienna here",
    verified: false // User must provide this photo
  },
  albertina: {
    id: '/assets/photos/albertina.jpg',
    alt: "Albertina Museum Vienna - Modern Art Collection",
    category: 'museum',
    searchTerm: "Place your photo of Albertina Museum in Vienna here",
    verified: false // User must provide this photo
  },
  haus_des_meeres: {
    id: '/assets/photos/haus_des_meeres.jpg',
    alt: "Haus des Meeres Vienna - Aquarium in WWII Bunker",
    category: 'aquarium',
    searchTerm: "Place your photo of Haus des Meeres in Vienna here",
    verified: false // User must provide this photo
  }
};

// GENERIC PLACEHOLDER IMAGES WHEN USER PHOTOS DON'T EXIST
// These are shown until user provides their own photos
export const FALLBACK_PHOTOS: Record<string, PhotoConfig> = {
  cathedral: {
    id: '/assets/photos/placeholder-cathedral.jpg',
    alt: "Gothic Cathedral Architecture - Add your Vienna photo",
    category: 'cathedral',
    searchTerm: "Add stephansdom.jpg to show St. Stephen's Cathedral",
    verified: false
  },
  palace: {
    id: '/assets/photos/placeholder-palace.jpg',
    alt: "European Palace Architecture - Add your Vienna photo",
    category: 'palace',
    searchTerm: "Add belvedere.jpg, hofburg.jpg, or schonbrunn.jpg",
    verified: false
  },
  museum: {
    id: '/assets/photos/placeholder-museum.jpg',
    alt: "European Museum Architecture - Add your Vienna photo",
    category: 'museum',
    searchTerm: "Add khm.jpg or albertina.jpg",
    verified: false
  },
  coffee: {
    id: '/assets/photos/placeholder-coffee.jpg',
    alt: "Historic Viennese Café - Add your Vienna photo",
    category: 'coffee',
    searchTerm: "Add cafe_central.jpg for Café Central",
    verified: false
  },
  market: {
    id: '/assets/photos/placeholder-market.jpg',
    alt: "European Food Market - Add your Vienna photo",
    category: 'market',
    searchTerm: "Add naschmarkt.jpg",
    verified: false
  },
  restaurant: {
    id: '/assets/photos/placeholder-restaurant.jpg',
    alt: "European Restaurant - Add your Vienna photo",
    category: 'restaurant',
    searchTerm: "Add restaurant photos",
    verified: false
  },
  park: {
    id: '/assets/photos/placeholder-park.jpg',
    alt: "European City Park - Add your Vienna photo",
    category: 'park',
    searchTerm: "Add prater.jpg",
    verified: false
  },
  aquarium: {
    id: '/assets/photos/placeholder-aquarium.jpg',
    alt: "Modern Aquarium - Add your Vienna photo",
    category: 'aquarium',
    searchTerm: "Add haus_des_meeres.jpg",
    verified: false
  },
  general: {
    id: '/assets/photos/placeholder-general.jpg',
    alt: "European Architecture - Add your Vienna photo",
    category: 'general',
    searchTerm: "Add attraction photos to assets/photos/",
    verified: false
  }
};

/**
 * Generate local asset URL from photo path
 * Local format: /assets/photos/{filename}
 */
export function getLocalAssetUrl(photoPath: string): string {
  return photoPath; // Already includes /assets/photos/ prefix
}

/**
 * Get primary photo for an attraction (ONLY if user provided it)
 * Returns empty string if no user photo exists - no fallbacks
 */
export function getAttractionPhoto(attractionKey: string): string {
  const config = VIENNA_PHOTOS[attractionKey];
  if (!config) return '';

  // Only return photo path if user has actually provided the photo
  // Let the ViennaImage component handle the blank display
  return getLocalAssetUrl(config.id);
}

/**
 * Get fallback photo for a category (returns empty string - no generic images)
 */
export function getFallbackPhoto(): string {
  // No fallbacks - only show user-uploaded photos
  return '';
}

/**
 * Get photo config for debugging/documentation
 */
export function getPhotoConfig(attractionKey: string): PhotoConfig | null {
  return VIENNA_PHOTOS[attractionKey] || null;
}

/**
 * HOW TO ADD YOUR OWN VIENNA PHOTOS:
 *
 * 1. Take photos of actual Vienna attractions or find high-quality images
 * 2. Save them with these exact filenames in frontend/public/assets/photos/:
 *    - stephansdom.jpg (St. Stephen's Cathedral)
 *    - belvedere.jpg (Belvedere Palace)
 *    - hofburg.jpg (Hofburg Imperial Palace)
 *    - schonbrunn.jpg (Schönbrunn Palace)
 *    - prater.jpg (Prater Park/Ferris Wheel)
 *    - naschmarkt.jpg (Naschmarkt food market)
 *    - cafe_central.jpg (Café Central)
 *    - khm.jpg (Kunsthistorisches Museum)
 *    - albertina.jpg (Albertina Museum)
 *    - haus_des_meeres.jpg (Haus des Meeres Aquarium)
 *
 * 3. Recommended: 1200x800px or higher, JPG/PNG format
 * 4. Restart the application to see your photos
 * 5. If photos don't exist, placeholder messages will show instead
 *
 * WHY LOCAL PHOTOS INSTEAD OF AUTOMATED APIs:
 * - No more wrong photos (Colosseum instead of St. Stephen's)
 * - No more generic images (random cafés instead of Café Central)
 * - You control exactly what Vienna landmarks are shown
 * - Higher quality, personally curated images
 * - No API rate limits or external dependencies
 */

// EXPORT FOR USE IN COMPONENTS
export const viennaPhotos = VIENNA_PHOTOS;
export const fallbackPhotos = FALLBACK_PHOTOS;
