const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Query: { type: Object },
  CreatedAt: { type: Date, default: Date.now },
  Popularity: { type: Number, default: 0 },
}, { versionKey: false });

module.exports = mongoose.model('Searches', SearchSchema);
