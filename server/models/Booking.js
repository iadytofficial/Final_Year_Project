const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  TouristID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  ActivityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Activities', index: true },
  GuideID: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuides' },
  TransportProviderID: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportProviders' },
  ActivityDate: { type: Date, required: true },
  Slot: { type: String, enum: ['Morning','Afternoon','Evening','FullDay'], required: true },
  NumberOfParticipants: { type: Number, required: true },
  TotalCost: { type: Number, required: true },
  Status: { type: String, enum: ['Pending','Confirmed','Completed','Cancelled'], default: 'Pending' },
  GuideStatus: { type: String, enum: ['NotRequested','Pending','Confirmed','Declined'], default: 'NotRequested' },
  TransportStatus: { type: String, enum: ['NotRequested','Pending','Confirmed','Declined'], default: 'NotRequested' },
  BookingDate: { type: Date, default: Date.now },
  SpecialRequests: { type: String },
  CancellationRequested: { type: Boolean, default: false },
  CancellationReason: { type: String },
}, { versionKey: false });

module.exports = mongoose.model('Bookings', BookingSchema);
