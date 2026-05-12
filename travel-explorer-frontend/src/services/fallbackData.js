// Fallback data for popular destinations when Wikipedia fails
export const fallbackDestinations = {
  'kerala': {
    title: 'Kerala',
    extract: 'Kerala, a state on India\'s tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It\'s known for its palm-lined beaches and backwaters, a network of canals. Inland are the Western Ghats, mountains whose slopes support tea, coffee and spice plantations as well as wildlife. National parks like Eravikulam and Periyar, plus Wayanad and other sanctuaries, are home to elephants, langur monkeys and tigers.',
    thumbnail: {
      source: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFFWWAqgALTSQhRrHjUuNjsbsISPFzBQ7DIA&s'
    }
  },
  'paris': {
    title: 'Paris',
    extract: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.',
    thumbnail: {
      source: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5yY4wjJaC_3aA8tMBfLqvdTnbYsQeTcCZFw&s'
    }
  },
  'bali': {
    title: 'Bali',
    extract: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars, while Seminyak, Sanur and Nusa Dua are popular resort towns. The island is also known for its yoga and meditation retreats.',
    thumbnail: {
      source: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUCYG5QeI6o57NH06gy_Iw_A2w0Hg6SVoLsw&s'
    }
  },
  // Add more fallback data as needed
};

export const getFallbackData = (placeName) => {
  const key = placeName.toLowerCase();
  return fallbackDestinations[key] || {
    title: placeName,
    extract: `Discover the beautiful destination of ${placeName}. This place offers unique cultural experiences, stunning landscapes, and memorable adventures for travelers.`,
    thumbnail: {
      source: 'https://cdn.pixabay.com/photo/2017/06/05/19/05/landscape-2374657_1280.jpg'
    }
  };
};