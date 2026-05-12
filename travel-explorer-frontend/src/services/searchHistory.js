const API_BASE_URL = 'https://travelexplore.onrender.com/api';

export const searchHistoryService = {
    // Save search to history
    async saveSearch(query, additionalData = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    title: additionalData.title || query,
                    type: additionalData.type || 'destination',
                    description: additionalData.description || '',
                    image: additionalData.image || additionalData.thumbnail || '',
                    metadata: {
                        hasWikipedia: additionalData.hasWikipedia || false,
                        wikipediaFailed: additionalData.wikipediaFailed || false,
                        extract: additionalData.extract || '',
                        thumbnail: additionalData.thumbnail || '',
                        fromCard: additionalData.fromCard || false,
                        isFeedback: additionalData.isFeedback || false,
                        ...additionalData.metadata
                    }
                }),
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to save search history');
            }

            return data;
        } catch (error) {
            console.error('Search history save error:', error);
            throw error;
        }
    },

    // Get user's search history
    async getSearchHistory(page = 1, limit = 20) {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history?page=${page}&limit=${limit}`, {
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch search history');
            }

            return data;
        } catch (error) {
            console.error('Search history fetch error:', error);
            throw error;
        }
    },

    // Get recent searches
    async getRecentSearches() {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history/recent`, {
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch recent searches');
            }

            return data;
        } catch (error) {
            console.error('Recent searches fetch error:', error);
            throw error;
        }
    },

    // Get popular destinations
    async getPopularDestinations() {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history/popular`, {
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch popular destinations');
            }

            return data;
        } catch (error) {
            console.error('Popular destinations fetch error:', error);
            throw error;
        }
    },

    // Delete search history item
    async deleteHistoryItem(historyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history/${historyId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete history item');
            }

            return data;
        } catch (error) {
            console.error('Delete history item error:', error);
            throw error;
        }
    },

    // Clear all search history
    async clearAllHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to clear history');
            }

            return data;
        } catch (error) {
            console.error('Clear history error:', error);
            throw error;
        }
    },

    // Get history statistics
    async getHistoryStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/search-history/stats`, {
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch history stats');
            }

            return data;
        } catch (error) {
            console.error('History stats fetch error:', error);
            throw error;
        }
    }
};