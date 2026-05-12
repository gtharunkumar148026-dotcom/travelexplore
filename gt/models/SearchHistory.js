const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['destination', 'attraction', 'city', 'landmark', 'general'],
    default: 'destination'
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  metadata: {
    hasWikipedia: { type: Boolean, default: false },
    wikipediaFailed: { type: Boolean, default: false },
    extract: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    fromCard: { type: Boolean, default: false },
    isFeedback: { type: Boolean, default: false }
  },
  viewCount: {
    type: Number,
    default: 1
  },
  lastViewedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for better query performance
searchHistorySchema.index({ userId: 1, lastViewedAt: -1 });
searchHistorySchema.index({ userId: 1, query: 1 }, { unique: true });

// Update lastViewedAt and increment viewCount before saving
searchHistorySchema.pre('save', function(next) {
  this.lastViewedAt = new Date();
  next();
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);