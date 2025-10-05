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
}, { versionKey: false });

module.exports = mongoose.model('TourGuides', TourGuideSchema);
