const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema({
  PaymentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Payments', index: true },
  BookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', index: true },
  Amount: { type: Number, required: true },
  RefundDate: { type: Date, default: Date.now },
  Reason: { type: String },
  Status: { type: String },
  ProcessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  RefundMethod: { type: String },
}, { versionKey: false });

module.exports = mongoose.model('Refunds', RefundSchema);
