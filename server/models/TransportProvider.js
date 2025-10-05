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
}, { versionKey: false });

module.exports = mongoose.model('TransportProviders', TransportProviderSchema);
