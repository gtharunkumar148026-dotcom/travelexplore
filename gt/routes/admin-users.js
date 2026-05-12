const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Feedback = require('../models/Feedback');

const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
};

// Get all users with pagination
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password -__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });

        res.json({
            success: true,
            users,
            stats: {
                totalUsers,
                activeUsers,
                adminUsers,
                regularUsers: totalUsers - adminUsers
            },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch users' 
        });
    }
});

// Get user details with login history
router.get('/users/:id', requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -__v')
            .populate('loginHistory');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user details' 
        });
    }
});

// Update user role or status
router.put('/users/:id', requireAdmin, async (req, res) => {
    try {
        const { role, isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { 
                ...(role && { role }),
                ...(isActive !== undefined && { isActive })
            },
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update user' 
        });
    }
});

// Get all feedback with pagination
router.get('/feedback', requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const category = req.query.category;

        let query = {};
        if (status && status !== 'all') query.status = status;
        if (category && category !== 'all') query.category = category;

        const feedback = await Feedback.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalFeedback = await Feedback.countDocuments(query);
        const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
        const reviewedFeedback = await Feedback.countDocuments({ status: 'reviewed' });

        res.json({
            success: true,
            feedback,
            stats: {
                totalFeedback,
                pendingFeedback,
                reviewedFeedback
            },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFeedback / limit),
                totalFeedback
            }
        });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch feedback' 
        });
    }
});

// Update feedback status or add response
router.put('/feedback/:id', requireAdmin, async (req, res) => {
    try {
        const { status, adminNotes, response } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (response !== undefined) {
            updateData.response = response;
            updateData.responded = true;
            updateData.respondedAt = new Date();
        }

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({ 
                success: false, 
                message: 'Feedback not found' 
            });
        }

        res.json({
            success: true,
            message: 'Feedback updated successfully',
            feedback
        });
    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update feedback' 
        });
    }
});

// Delete feedback
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

// Get dashboard statistics
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const totalFeedback = await Feedback.countDocuments();
        const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });

        // Get today's logins
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLogins = await User.countDocuments({
            lastLogin: { $gte: today }
        });

        // Get user registration growth (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: lastWeek }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                adminUsers,
                totalFeedback,
                pendingFeedback,
                todayLogins,
                newUsersThisWeek
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch dashboard statistics' 
        });
    }
});

module.exports = router;