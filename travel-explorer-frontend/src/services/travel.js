// src/services/travel.js
export const travelService = {
  searchPlace,
  getBookingOptions,
  getTouristSpots
};

/**
 * Search for a place using Wikipedia or fallback API
 * @param {string} place
 * @returns {Promise<object>} search result
 */
async function searchPlace(place) {
  try {
    const res = await fetch(`/api/travel/search?place=${encodeURIComponent(place)}`);
    if (!res.ok) throw new Error('Failed to fetch travel info');
    return await res.json();
  } catch (error) {
    console.error('travelService.searchPlace error:', error);
    throw error;
  }
}

/**
 * Fetch booking options for a place
 * @param {string} place
 * @returns {Array} booking objects
 */
function getBookingOptions(place) {
  // Example static data (replace with API call if available)
  return [
    {
      name: `${place} Grand Hotel`,
      type: 'Hotel',
      price: '$100 - $200',
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place)}+Hotel`
    },
    {
      name: `${place} Local Restaurant`,
      type: 'Dining',
      price: '$10 - $50',
      url: `https://www.google.com/search?q=${encodeURIComponent(place)}+restaurant`
    }
  ];
}

/**
 * Fetch tourist spots for a place
 * @param {string} place
 * @returns {Array} tourist spot objects
 */
function getTouristSpots(place) {
  // Example static data (replace with API call if available)
  return [
    {
      name: `${place} Museum`,
      type: 'Museum',
      imagesUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+museum&tbm=isch`,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+museum`
    },
    {
      name: `${place} Park`,
      type: 'Park',
      imagesUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+park&tbm=isch`,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+park`
    }
  ];
}
