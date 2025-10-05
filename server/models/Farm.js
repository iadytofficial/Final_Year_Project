const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  FarmName: { type: String, required: true },
  FarmType: { type: String },
  VerificationStatus: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  Description: { type: String, maxlength: 1000 },
  Location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  Facilities: [{ type: String }],
  Images: [{ type: String }],
}, { versionKey: false });

FarmSchema.index({ 'Location.coordinates': '2dsphere' });

module.exports = mongoose.model('Farms', FarmSchema);
