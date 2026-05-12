const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Please log in to access favorites' });
    next();
};

// GET all favorites for current user
router.get('/', requireLogin, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.session.userId })
            .sort({ createdAt: -1 });
        res.json(favorites);
    } catch (err) {
        console.error('Error fetching favorites:', err);
        res.status(500).json({ message: 'Failed to fetch favorites' });
    }
});

// Add favorite
router.post('/', requireLogin, async (req, res) => {
    try {
        const { itemId, itemType, title, description, image, metadata } = req.body;
        
        // Check if already favorited
        const existingFavorite = await Favorite.findOne({ 
            userId: req.session.userId, 
            itemId: itemId 
        });
        
        if (existingFavorite) {
            return res.status(400).json({ message: 'Already in favorites' });
        }

        const favorite = await Favorite.create({ 
            userId: req.session.userId, 
            itemId, 
            itemType, 
            title, 
            description, 
            image,
            metadata: metadata || {}
        });
        
        res.status(201).json(favorite);
    } catch (err) {
        console.error('Error adding favorite:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Already in favorites' });
        }
        res.status(500).json({ message: 'Failed to add favorite' });
    }
});

// Delete favorite by favorite ID (not itemId)
router.delete('/:favoriteId', requireLogin, async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({ 
            _id: req.params.favoriteId,
            userId: req.session.userId 
        });
        
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        
        res.json({ success: true, message: 'Favorite removed' });
    } catch (err) {
        console.error('Error deleting favorite:', err);
        res.status(500).json({ message: 'Failed to delete favorite' });
    }
});

// Check if item is favorited
router.get('/check/:itemId', requireLogin, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ 
            userId: req.session.userId, 
            itemId: req.params.itemId 
        });
        res.json({ isFavorite: !!favorite, favoriteId: favorite?._id });
    } catch (err) {
        console.error('Error checking favorite:', err);
        res.status(500).json({ message: 'Failed to check favorite' });
    }
});

// Delete all favorites for user
router.delete('/', requireLogin, async (req, res) => {
    try {
        await Favorite.deleteMany({ userId: req.session.userId });
        res.json({ success: true, message: 'All favorites cleared' });
    } catch (err) {
        console.error('Error clearing favorites:', err);
        res.status(500).json({ message: 'Failed to clear favorites' });
    }
});

module.exports = router;