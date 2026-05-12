const express = require('express');
const router = express.Router();
const User = require('../models/User');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Please log in to access this resource' 
        });
    }
    next();
};

// Get user profile
router.get('/profile', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .select('-password -loginHistory -__v');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch profile' 
        });
    }
});

// Update user profile
router.put('/profile', requireLogin, async (req, res) => {
    try {
        const { name, email, phone, bio } = req.body;

        console.log('🔄 Updating profile for user:', req.session.userId);
        console.log('📝 Update data:', { name, email, phone, bio });

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ 
                email: email.toLowerCase(),
                _id: { $ne: req.session.userId }
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email is already taken by another user' 
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.session.userId,
            { 
                name: name?.trim(),
                email: email?.toLowerCase().trim(),
                phone: phone?.trim(),
                bio: bio?.trim()
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password -loginHistory -__v');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        console.log('✅ Profile updated successfully:', user._id);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('❌ Update profile error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: messages.join(', ') 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update profile' 
        });
    }
});

module.exports = router;