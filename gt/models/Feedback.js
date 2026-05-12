const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        default: 'General Feedback'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    category: {
        type: String,
        enum: ['general', 'bug', 'feature', 'suggestion', 'complaint'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'closed'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    responded: {
        type: Boolean,
        default: false
    },
    response: {
        type: String,
        default: ''
    },
    respondedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for better query performance
feedbackSchema.index({ userEmail: 1, createdAt: -1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);