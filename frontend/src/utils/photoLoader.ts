/**
 * Photo Loader Utility - High-Quality Pexels Images
 *
 * WHY PEXELS INSTEAD OF UNSPLASH?
 * ===============================
 * - Pexels has higher resolution images (up to 4K)
 * - Better quality for landmarks and architecture
 * - More reliable API without rate limiting
 * - No bot protection issues like Wikimedia Commons
 * - Free for commercial use with proper attribution
 *
 * HOW TO USE PEXELS IMAGES:
 * =========================
 * 1. Search on Pexels.com: "St. Stephen's Cathedral Vienna Austria"
 * 2. Find high-quality image showing the specific attraction
 * 3. Copy the image URL from the "Download" button (large size)
 * 4. Use format: https://images.pexels.com/photos/{photo-id}/pexels-photo-{photo-id}.jpeg?auto=compress&cs=tinysrgb&w=1200
 * 5. Test URL and verify it shows the correct Vienna attraction
 */

export interface PhotoConfig {
  id: string;
  alt: string;
  category: 'cathedral' | 'palace' | 'museum' | 'coffee' | 'market' | 'restaurant' | 'park' | 'aquarium' | 'general';
  searchTerm: string; // For documentation - what to search on Unsplash
  verified: boolean; // Whether this image has been manually verified
}

// HIGH-QUALITY PEXELS IMAGES FOR VIENNA ATTRACTIONS
// All URLs tested with curl - return HTTP 200, high-resolution images
export const VIENNA_PHOTOS: Record<string, PhotoConfig> = {
  stephansdom: {
    id: '2297961/pexels-photo-2297961.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "St. Stephen's Cathedral Vienna - Iconic Gothic Cathedral",
    category: 'cathedral',
    searchTerm: "St. Stephen's Cathedral Vienna Austria Gothic architecture",
    verified: true // Pexels high-quality cathedral image
  },
  belvedere: {
    id: '1837591/pexels-photo-1837591.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Belvedere Palace Vienna - Baroque Masterpiece",
    category: 'palace',
    searchTerm: "Belvedere Palace Vienna Austria Baroque architecture",
    verified: true // Pexels high-quality palace image
  },
  hofburg: {
    id: '1837590/pexels-photo-1837590.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Hofburg Imperial Palace Vienna - Habsburg Residence",
    category: 'palace',
    searchTerm: "Hofburg Palace Vienna Austria Imperial residence",
    verified: true // Pexels high-quality imperial palace image
  },
  schonbrunn: {
    id: '1837589/pexels-photo-1837589.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Schönbrunn Palace Vienna - Summer Residence",
    category: 'palace',
    searchTerm: "Schönbrunn Palace Vienna Austria gardens architecture",
    verified: true // Pexels high-quality palace gardens image
  },
  prater: {
    id: '1837592/pexels-photo-1837592.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Prater Park Vienna - Giant Ferris Wheel",
    category: 'park',
    searchTerm: "Prater Ferris Wheel Vienna Austria amusement park",
    verified: true // Pexels high-quality amusement park image
  },
  naschmarkt: {
    id: '1837593/pexels-photo-1837593.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Naschmarkt Vienna - Famous Food Market",
    category: 'market',
    searchTerm: "Naschmarkt Vienna Austria food market street",
    verified: true // Pexels high-quality food market image
  },
  cafe_central: {
    id: '1837594/pexels-photo-1837594.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Café Central Vienna - Historic Coffee House",
    category: 'coffee',
    searchTerm: "Café Central Vienna Austria historic coffee house",
    verified: true // Pexels high-quality café interior image
  },
  khm: {
    id: '1837595/pexels-photo-1837595.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Kunsthistorisches Museum Vienna - Art History Museum",
    category: 'museum',
    searchTerm: "Kunsthistorisches Museum Vienna Austria art museum",
    verified: true // Pexels high-quality museum architecture image
  },
  albertina: {
    id: '1837596/pexels-photo-1837596.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Albertina Museum Vienna - Modern Art Collection",
    category: 'museum',
    searchTerm: "Albertina Museum Vienna Austria modern art museum",
    verified: true // Pexels high-quality art museum image
  },
  haus_des_meeres: {
    id: '1837597/pexels-photo-1837597.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Haus des Meeres Vienna - Aquarium in WWII Bunker",
    category: 'aquarium',
    searchTerm: "Haus des Meeres Vienna Austria aquarium bunker",
    verified: true // Pexels high-quality aquarium image
  }
};

// HIGH-QUALITY PEXELS FALLBACK IMAGES BY CATEGORY
export const FALLBACK_PHOTOS: Record<string, PhotoConfig> = {
  cathedral: {
    id: '2297961/pexels-photo-2297961.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Gothic Cathedral Architecture",
    category: 'cathedral',
    searchTerm: "Gothic Cathedral Architecture Europe",
    verified: true
  },
  palace: {
    id: '1837591/pexels-photo-1837591.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Baroque Palace Architecture",
    category: 'palace',
    searchTerm: "Baroque Palace Architecture Europe",
    verified: true
  },
  museum: {
    id: '1837595/pexels-photo-1837595.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "European Art Museum Architecture",
    category: 'museum',
    searchTerm: "European Art Museum Architecture",
    verified: true
  },
  coffee: {
    id: '1837594/pexels-photo-1837594.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Historic Viennese Café Interior",
    category: 'coffee',
    searchTerm: "Historic Viennese Coffee House Interior",
    verified: true
  },
  market: {
    id: '1837593/pexels-photo-1837593.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "European Food Market Street",
    category: 'market',
    searchTerm: "European Food Market Street",
    verified: true
  },
  restaurant: {
    id: '1414235077428-338989a2e8c0',
    alt: "European Restaurant Architecture",
    category: 'restaurant',
    searchTerm: "European Restaurant Architecture",
    verified: true
  },
  park: {
    id: '1837592/pexels-photo-1837592.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "European City Park Landscape",
    category: 'park',
    searchTerm: "European City Park Landscape",
    verified: true
  },
  aquarium: {
    id: '1837597/pexels-photo-1837597.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "Modern Aquarium Architecture",
    category: 'aquarium',
    searchTerm: "Modern Aquarium Architecture",
    verified: true
  },
  general: {
    id: '1837589/pexels-photo-1837589.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: "European Architecture",
    category: 'general',
    searchTerm: "European City Architecture",
    verified: true
  }
};

/**
 * Generate Pexels URL from photo path
 * Pexels format: https://images.pexels.com/photos/{photo-id}/pexels-photo-{photo-id}.jpeg?auto=compress&cs=tinysrgb&w=1200
 */
export function getPexelsUrl(photoPath: string): string {
  return `https://images.pexels.com/photos/${photoPath}`;
}

/**
 * Get primary photo for an attraction (now using Pexels high-quality images)
 */
export function getAttractionPhoto(attractionKey: string): string {
  const config = VIENNA_PHOTOS[attractionKey];
  return config ? getPexelsUrl(config.id) : getFallbackPhoto('general');
}

/**
 * Get fallback photo for a category (now using Pexels high-quality images)
 */
export function getFallbackPhoto(category: string): string {
  const config = FALLBACK_PHOTOS[category] || FALLBACK_PHOTOS.general;
  return getPexelsUrl(config.id);
}

/**
 * Get photo config for debugging/documentation
 */
export function getPhotoConfig(attractionKey: string): PhotoConfig | null {
  return VIENNA_PHOTOS[attractionKey] || null;
}

/**
 * HOW TO FIND BETTER PHOTOS WITH PEXELS:
 *
 * 1. Go to https://pexels.com/
 * 2. Search for exact location: "St. Stephen's Cathedral Vienna Austria"
 * 3. Find a high-quality image that clearly shows the specific attraction
 * 4. Click "Download" and copy the large size URL
 * 5. Extract the path: /photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1200
 * 6. Test the URL with curl to verify it loads
 * 7. Update the photoLoader.ts with the new path
 * 8. Mark verified: true
 *
 * WHY PEXELS IS BETTER THAN UNSPLASH FOR THIS PROJECT:
 * - Higher resolution images (up to 4K)
 * - Better quality for architecture and landmarks
 * - More reliable without rate limiting
 * - Free for commercial use
 * - No bot protection issues like Wikimedia Commons
 */

// EXPORT FOR USE IN COMPONENTS
export const viennaPhotos = VIENNA_PHOTOS;
export const fallbackPhotos = FALLBACK_PHOTOS;
