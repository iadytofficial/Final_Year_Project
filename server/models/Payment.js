const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  BookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', index: true },
  Amount: { type: Number, required: true },
  Status: { type: String, enum: ['Pending','Success','Failed','Refunded'], default: 'Pending' },
  TransactionID: { type: String },
  PaymentMethod: { type: String },
  PaymentDate: { type: Date },
  RefundAmount: { type: Number },
  RefundDate: { type: Date },
  RefundReason: { type: String },
  PayoutID: { type: mongoose.Schema.Types.ObjectId, ref: 'Payouts' },
}, { versionKey: false });

module.exports = mongoose.model('Payments', PaymentSchema);
