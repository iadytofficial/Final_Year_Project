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
  Geo: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere',
    },
  },
}, { versionKey: false });

FarmSchema.pre('save', function(next) {
  if (this.Location && this.Location.coordinates && typeof this.Location.coordinates.lat === 'number' && typeof this.Location.coordinates.lng === 'number') {
    this.Geo = { type: 'Point', coordinates: [this.Location.coordinates.lng, this.Location.coordinates.lat] };
  }
  next();
});

module.exports = mongoose.model('Farms', FarmSchema);
