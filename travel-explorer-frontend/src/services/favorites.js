class FavoritesService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  async getFavorites(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/favorites/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  async addFavorite(favoriteData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(favoriteId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async isFavorite(userId, locationId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/favorites/${userId}/check/${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }
      
      const result = await response.json();
      return result.isFavorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
}

// Create instance
const favoritesService = new FavoritesService();

// Export both as default and named export
export default favoritesService;
export { favoritesService };