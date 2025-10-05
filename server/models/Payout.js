const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Amount: { type: Number, required: true },
  PayoutDate: { type: Date, default: Date.now },
  PaymentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payments' }],
  Status: { type: String, enum: ['Pending','Completed','Failed'], default: 'Pending' },
  BankDetails: { type: Object },
  AdminID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  PayoutMethod: { type: String },
  BankAccountDetails: { type: Object },
  TaxDeduction: { type: Number, default: 0 },
  NetAmount: { type: Number, default: 0 },
  Invoice: { type: String },
  PayoutPeriod: { startDate: Date, endDate: Date },
}, { versionKey: false });

module.exports = mongoose.model('Payouts', PayoutSchema);
