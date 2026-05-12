import React, { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import './FavoriteButton.css';

const FavoriteButton = ({ itemId, itemType, title, description, image, size = 'medium', showText = false }) => {
  const { addFavorite, removeFavorite, isFavorite, getFavoriteId, loading: favoritesLoading } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (isLoading || favoritesLoading) return;
    
    setIsLoading(true);
    try {
      if (isFavorite(itemId)) {
        const favoriteId = getFavoriteId(itemId);
        if (favoriteId) {
          await removeFavorite(favoriteId);
        }
      } else {
        await addFavorite({ 
          itemId, 
          itemType, 
          title, 
          description, 
          image,
          metadata: { image, type: itemType }
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // You can show a toast notification here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const favorited = isFavorite(itemId);

  if (!isLoading && !favoritesLoading) {
    return (
      <button
        className={`favorite-btn ${favorited ? 'favorited' : ''} ${size} ${isLoading ? 'loading' : ''}`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <span className="favorite-icon">
          {favorited ? '❤️' : '🤍'}
        </span>
        {showText && (
          <span className="favorite-text">
            {favorited ? 'Favorited' : 'Add to Favorites'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      className={`favorite-btn loading ${size}`}
      disabled
    >
      <span className="favorite-icon">⏳</span>
      {showText && <span className="favorite-text">Loading...</span>}
    </button>
  );
};

export default FavoriteButton;