const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in to access search history' });
    }
    next();
};

// Save or update search history
router.post('/save', requireLogin, async (req, res) => {
    try {
        const { query, title, type, description, image, metadata } = req.body;

        if (!query || !title) {
            return res.status(400).json({ message: 'Query and title are required' });
        }

        // Check if this search already exists for the user
        const existingHistory = await SearchHistory.findOne({
            userId: req.session.userId,
            query: query.trim().toLowerCase()
        });

        let historyItem;

        if (existingHistory) {
            // Update existing record - increment view count and update timestamp
            historyItem = await SearchHistory.findOneAndUpdate(
                { 
                    userId: req.session.userId, 
                    query: query.trim().toLowerCase() 
                },
                { 
                    $inc: { viewCount: 1 },
                    lastViewedAt: new Date(),
                    title: title || existingHistory.title,
                    description: description || existingHistory.description,
                    image: image || existingHistory.image,
                    metadata: { ...existingHistory.metadata, ...metadata }
                },
                { new: true, runValidators: true }
            );
        } else {
            // Create new history record
            historyItem = await SearchHistory.create({
                userId: req.session.userId,
                query: query.trim().toLowerCase(),
                title: title,
                type: type || 'destination',
                description: description || '',
                image: image || '',
                metadata: metadata || {}
            });
        }

        res.json({
            success: true,
            message: existingHistory ? 'Search history updated' : 'Search history saved',
            data: historyItem
        });
    } catch (err) {
        console.error('Error saving search history:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to save search history' 
        });
    }
});

// GET user's search history
router.get('/', requireLogin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const history = await SearchHistory.find({ userId: req.session.userId })
            .sort({ lastViewedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await SearchHistory.countDocuments({ userId: req.session.userId });

        res.json({
            success: true,
            history,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (err) {
        console.error('Error fetching search history:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch search history' 
        });
    }
});

// GET recent search history (last 10 items)
router.get('/recent', requireLogin, async (req, res) => {
    try {
        const recentHistory = await SearchHistory.find({ userId: req.session.userId })
            .sort({ lastViewedAt: -1 })
            .limit(10)
            .select('query title type lastViewedAt');

        res.json({
            success: true,
            history: recentHistory
        });
    } catch (err) {
        console.error('Error fetching recent history:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch recent history' 
        });
    }
});

// GET most viewed destinations
router.get('/popular', requireLogin, async (req, res) => {
    try {
        const popularDestinations = await SearchHistory.find({ userId: req.session.userId })
            .sort({ viewCount: -1, lastViewedAt: -1 })
            .limit(10)
            .select('title type viewCount lastViewedAt image');

        res.json({
            success: true,
            popular: popularDestinations
        });
    } catch (err) {
        console.error('Error fetching popular destinations:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch popular destinations' 
        });
    }
});

// DELETE specific search history item
router.delete('/:id', requireLogin, async (req, res) => {
    try {
        const historyItem = await SearchHistory.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!historyItem) {
            return res.status(404).json({ 
                success: false,
                message: 'History item not found' 
            });
        }

        res.json({
            success: true,
            message: 'History item deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting history item:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete history item' 
        });
    }
});

// DELETE all search history
router.delete('/', requireLogin, async (req, res) => {
    try {
        await SearchHistory.deleteMany({ userId: req.session.userId });

        res.json({
            success: true,
            message: 'All search history cleared successfully'
        });
    } catch (err) {
        console.error('Error clearing search history:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to clear search history' 
        });
    }
});

// GET search history statistics
router.get('/stats', requireLogin, async (req, res) => {
    try {
        const totalSearches = await SearchHistory.countDocuments({ userId: req.session.userId });
        
        const mostViewed = await SearchHistory.findOne({ userId: req.session.userId })
            .sort({ viewCount: -1 })
            .select('title viewCount');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaySearches = await SearchHistory.countDocuments({
            userId: req.session.userId,
            lastViewedAt: { $gte: today }
        });

        const typeStats = await SearchHistory.aggregate([
            { $match: { userId: req.session.userId } },
            { $group: { 
                _id: '$type', 
                count: { $sum: 1 },
                totalViews: { $sum: '$viewCount' }
            }},
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            stats: {
                totalSearches,
                todaySearches,
                mostViewed: mostViewed || null,
                typeDistribution: typeStats
            }
        });
    } catch (err) {
        console.error('Error fetching history stats:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch history statistics' 
        });
    }
});

module.exports = router;