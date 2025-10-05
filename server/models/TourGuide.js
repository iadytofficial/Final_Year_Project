const mongoose = require('mongoose');

const TourGuideSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  LicenseNumber: { type: String, unique: true },
  NIC: { type: String, unique: true },
  VerificationStatus: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  YearsOfExperience: { type: Number, default: 0 },
  LanguageSpoken: [{ type: String }],
  Bio: { type: String },
  PricePerDay: { type: Number, default: 0 },
  AvailabilityCalendar: [{ type: Date }],
  Location: { address: String, coordinates: { lat: Number, lng: Number } },
  Geo: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
}, { versionKey: false });

TourGuideSchema.pre('save', function(next) {
  if (this.Location && this.Location.coordinates && typeof this.Location.coordinates.lat === 'number' && typeof this.Location.coordinates.lng === 'number') {
    this.Geo = { type: 'Point', coordinates: [this.Location.coordinates.lng, this.Location.coordinates.lat] };
  }
  next();
});

module.exports = mongoose.model('TourGuides', TourGuideSchema);
