const mongoose = require('mongoose');

const TransportProviderSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  VehicleType: { type: String },
  VehicleRegistrationNo: { type: String, unique: true },
  VerificationStatus: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  MaxPassengers: { type: Number, default: 0 },
  LicenseCardPic: { type: String },
  PricePerKm: { type: Number, default: 0 },
  AvailabilityCalendar: [{ type: Date }],
  Location: { address: String, coordinates: { lat: Number, lng: Number } },
  Geo: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
}, { versionKey: false });

TransportProviderSchema.pre('save', function(next) {
  if (this.Location && this.Location.coordinates && typeof this.Location.coordinates.lat === 'number' && typeof this.Location.coordinates.lng === 'number') {
    this.Geo = { type: 'Point', coordinates: [this.Location.coordinates.lng, this.Location.coordinates.lat] };
  }
  next();
});

module.exports = mongoose.model('TransportProviders', TransportProviderSchema);
