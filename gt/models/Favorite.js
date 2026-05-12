const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: String, required: true },
  itemType: { type: String, enum: ['destination', 'hotel', 'activity', 'booking', 'attraction'], required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  metadata: { type: Object, default: {} },
}, {
  timestamps: true
});

// Prevent duplicate favorites per user
favoriteSchema.index({ userId: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
