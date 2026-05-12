const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// ✅ Admin middleware
const requireAdmin = (req, res, next) => {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
};

// ✅ Get all feedback (admin only)
router.get('/feedback', requireAdmin, async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: feedback.length,
            feedback
        });

    } catch (error) {
        console.error('Admin feedback error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch feedback' 
        });
    }
});

// ✅ Get dashboard stats (admin only)
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFeedback = await Feedback.countDocuments();
        const activeUsers = await User.countDocuments({ isCurrentlyLoggedIn: true });
        const adminUsers = await User.countDocuments({ isAdmin: true });

        // Get recent users
        const recentUsers = await User.find()
            .select('name email createdAt lastLogin')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent feedback
        const recentFeedback = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalFeedback,
                activeUsers,
                adminUsers
            },
            recentUsers,
            recentFeedback
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch dashboard stats' 
        });
    }
});

// ✅ Delete feedback (admin only)
router.delete('/feedback/:id', requireAdmin, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback deleted successfully'
        });

    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete feedback' 
        });
    }
});

module.exports = router;