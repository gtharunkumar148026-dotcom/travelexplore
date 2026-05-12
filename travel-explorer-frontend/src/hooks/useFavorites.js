import { useState, useEffect, useContext } from 'react';
import { useAuth } from './useAuth';

export const useFavorites = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load favorites when user changes
    useEffect(() => {
        if (user?.loggedIn) {
            loadFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    const loadFavorites = async () => {
        if (!user?.loggedIn) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/favorites', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            } else {
                throw new Error('Failed to load favorites');
            }
        } catch (err) {
            console.error('Error loading favorites:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addFavorite = async (favoriteData) => {
        if (!user?.loggedIn) {
            throw new Error('Please log in to add favorites');
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(favoriteData),
                credentials: 'include'
            });

            if (response.ok) {
                const newFavorite = await response.json();
                setFavorites(prev => [newFavorite, ...prev]);
                return newFavorite;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add favorite');
            }
        } catch (err) {
            console.error('Error adding favorite:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (favoriteId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setFavorites(prev => prev.filter(fav => fav._id !== favoriteId));
            } else {
                throw new Error('Failed to remove favorite');
            }
        } catch (err) {
            console.error('Error removing favorite:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (itemId) => {
        return favorites.some(fav => fav.itemId === itemId);
    };

    const getFavoriteId = (itemId) => {
        const favorite = favorites.find(fav => fav.itemId === itemId);
        return favorite?._id;
    };

    return {
        favorites,
        loading,
        error,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavoriteId,
        refreshFavorites: loadFavorites
    };
};