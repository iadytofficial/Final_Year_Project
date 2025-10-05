const mongoose = require('mongoose');

const BroadcastRequestSchema = new mongoose.Schema({
  BookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', index: true },
  ServiceType: { type: String, enum: ['Guide','Transport'], required: true },
  ProviderUserIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  AcceptedByUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  Status: { type: String, enum: ['Pending','Accepted','Timeout','Cancelled'], default: 'Pending' },
  ExpiresAt: { type: Date, required: true },
  CreatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('BroadcastRequests', BroadcastRequestSchema);
