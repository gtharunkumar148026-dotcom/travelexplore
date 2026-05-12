const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in to access blogs' });
    }
    next();
};

// GET all published blogs (public route)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email')
            .select('-__v');

        const total = await Blog.countDocuments({ isPublished: true });

        res.json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBlogs: total
        });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
});

// GET blogs by current user
router.get('/my-blogs', requireLogin, async (req, res) => {
    try {
        const blogs = await Blog.find({ userId: req.session.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .select('-__v');

        res.json(blogs);
    } catch (err) {
        console.error('Error fetching user blogs:', err);
        res.status(500).json({ message: 'Failed to fetch your blogs' });
    }
});

// GET single blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('userId', 'name email')
            .select('-__v');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (!blog.isPublished && (!req.session.userId || blog.userId._id.toString() !== req.session.userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(blog);
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
});

// CREATE new blog
router.post('/', requireLogin, async (req, res) => {
    try {
        const { title, content, image, location, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const blog = await Blog.create({
            userId: req.session.userId,
            author: req.session.userName || 'Anonymous',
            title,
            content,
            image: image || '',
            location: location || '',
            tags: tags || [],
            isPublished: true
        });

        const populatedBlog = await Blog.findById(blog._id)
            .populate('userId', 'name email')
            .select('-__v');

        res.status(201).json(populatedBlog);
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ message: 'Failed to create blog' });
    }
});

// UPDATE blog
router.put('/:id', requireLogin, async (req, res) => {
    try {
        const { title, content, image, location, tags, isPublished } = req.body;

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user owns the blog
        if (blog.userId.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'You can only edit your own blogs' });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: title || blog.title,
                content: content || blog.content,
                image: image !== undefined ? image : blog.image,
                location: location !== undefined ? location : blog.location,
                tags: tags || blog.tags,
                isPublished: isPublished !== undefined ? isPublished : blog.isPublished
            },
            { new: true, runValidators: true }
        ).populate('userId', 'name email')
         .select('-__v');

        res.json(updatedBlog);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ message: 'Failed to update blog' });
    }
});

// DELETE blog
router.delete('/:id', requireLogin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user owns the blog
        if (blog.userId.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'You can only delete your own blogs' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ message: 'Failed to delete blog' });
    }
});

// LIKE/UNLIKE blog
router.post('/:id/like', requireLogin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const hasLiked = blog.likes.includes(req.session.userId);

        if (hasLiked) {
            // Unlike
            await Blog.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { likes: req.session.userId },
                    $inc: { likesCount: -1 }
                }
            );
            res.json({ liked: false, message: 'Blog unliked' });
        } else {
            // Like
            await Blog.findByIdAndUpdate(
                req.params.id,
                {
                    $addToSet: { likes: req.session.userId },
                    $inc: { likesCount: 1 }
                }
            );
            res.json({ liked: true, message: 'Blog liked' });
        }
    } catch (err) {
        console.error('Error toggling like:', err);
        res.status(500).json({ message: 'Failed to toggle like' });
    }
});

module.exports = router;