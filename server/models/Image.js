const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  OwnerUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  EntityType: { type: String, enum: ['Farm','Activity','Review','User'], required: true },
  EntityID: { type: mongoose.Schema.Types.ObjectId, required: true },
  Url: { type: String, required: true },
  Thumbnail150: { type: String },
  Thumbnail300: { type: String },
  Thumbnail600: { type: String },
  IsPrimary: { type: Boolean, default: false },
  AltText: { type: String },
  CreatedAt: { type: Date, default: Date.now },
  Order: { type: Number, default: 0 },
}, { versionKey: false });

module.exports = mongoose.model('Images', ImageSchema);
