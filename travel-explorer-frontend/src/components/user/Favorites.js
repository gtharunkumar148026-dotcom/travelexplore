import React, { useState, useEffect } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../hooks/useAuth';
import './Favorites.css';

const Favorites = () => {
    const { user } = useAuth();
    const { favorites, removeFavorite, loading, error, refreshFavorites } = useFavorites();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        refreshFavorites();
    }, []);

    const filteredFavorites = favorites.filter(fav => {
        if (filter === 'all') return true;
        return fav.itemType === filter;
    });

    const handleRemoveFavorite = async (favoriteId) => {
        if (window.confirm('Are you sure you want to remove this from favorites?')) {
            await removeFavorite(favoriteId);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'destination': return '🏝️';
            case 'attraction': return '🏛️';
            case 'booking': return '🏨';
            case 'activity': return '🎯';
            default: return '❤️';
        }
    };

    if (!user?.loggedIn) {
        return (
            <div className="favorites-container">
                <div className="favorites-header">
                    <h2>My Favorites</h2>
                </div>
                <div className="login-required">
                    <p>Please log in to view your favorites</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <div className="favorites-header">
                <h2>My Favorites</h2>
                <p>Your saved destinations and attractions</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="favorites-filter">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({favorites.length})
                </button>
                <button 
                    className={`filter-btn ${filter === 'destination' ? 'active' : ''}`}
                    onClick={() => setFilter('destination')}
                >
                    🏝️ Destinations
                </button>
                <button 
                    className={`filter-btn ${filter === 'attraction' ? 'active' : ''}`}
                    onClick={() => setFilter('attraction')}
                >
                    🏛️ Attractions
                </button>
                <button 
                    className={`filter-btn ${filter === 'booking' ? 'active' : ''}`}
                    onClick={() => setFilter('booking')}
                >
                    🏨 Bookings
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your favorites...</p>
                </div>
            ) : filteredFavorites.length === 0 ? (
                <div className="no-favorites">
                    <div className="no-favorites-icon">🤍</div>
                    <h3>No favorites yet</h3>
                    <p>Start exploring and add destinations to your favorites!</p>
                </div>
            ) : (
                <div className="favorites-grid">
                    {filteredFavorites.map((favorite) => (
                        <div key={favorite._id} className="favorite-card">
                            <div className="favorite-image">
                                {favorite.image ? (
                                    <img 
                                        src={favorite.image} 
                                        alt={favorite.title}
                                        onError={(e) => {
                                            e.target.src = 'https://source.unsplash.com/300x200/?travel,' + encodeURIComponent(favorite.title);
                                        }}
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        {getTypeIcon(favorite.itemType)}
                                    </div>
                                )}
                                <div className="favorite-type-badge">
                                    {getTypeIcon(favorite.itemType)} {favorite.itemType}
                                </div>
                            </div>
                            <div className="favorite-content">
                                <h3 className="favorite-title">{favorite.title}</h3>
                                <p className="favorite-description">{favorite.description}</p>
                                <div className="favorite-meta">
                                    <small>Added on {new Date(favorite.createdAt).toLocaleDateString()}</small>
                                </div>
                            </div>
                            <div className="favorite-actions">
                                <button 
                                    className="btn-remove"
                                    onClick={() => handleRemoveFavorite(favorite._id)}
                                    title="Remove from favorites"
                                >
                                    ❌ Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;