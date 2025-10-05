const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  ActivityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Activities', index: true },
  CreatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('Favorites', FavoriteSchema);
