const mongoose = require('mongoose');

const PublicContentSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Body: { type: String, required: true },
  Images: [{ type: String }],
  Type: { type: String, enum: ['SuccessStory','Destination'], required: true },
  Location: { address: String, coordinates: { lat: Number, lng: Number } },
  CreatedAt: { type: Date, default: Date.now },
  IsActive: { type: Boolean, default: true },
}, { versionKey: false });

module.exports = mongoose.model('PublicContent', PublicContentSchema);
