const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// ------------------ Middleware ------------------
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Please login to access this resource' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// ------------------ Submit Feedback ------------------
router.post('/submit', requireAuth, async (req, res) => {
    try {
        const { name, email, message, rating = 5, category = 'general' } = req.body;

        const feedback = await Feedback.create({
            userId: req.session.userId,
            name: name || req.session.userEmail,
            email: email || req.session.userEmail,
            message,
            rating,
            category
        });

        res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
    } catch (err) {
        console.error('Feedback error:', err);
        res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

// ------------------ Get User Feedback ------------------
router.get('/my-feedback', requireAuth, async (req, res) => {
    try {
        const feedback = await Feedback.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.json({ success: true, count: feedback.length, feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
    }
});

// ------------------ Get All Feedback (Admin Only) ------------------
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const feedback = await Feedback.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await Feedback.countDocuments();

        res.json({
            success: true,
            feedback,
            pagination: { currentPage: page, totalPages: Math.ceil(totalCount / limit), totalCount }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
    }
});

module.exports = router;
