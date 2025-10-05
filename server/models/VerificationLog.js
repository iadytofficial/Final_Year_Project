const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
  ProviderUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  AdminUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Action: { type: String, enum: ['Approved','Rejected'], required: true },
  Comments: { type: String },
  Timestamp: { type: Date, default: Date.now },
  DocumentsVerified: [{ type: String }],
}, { versionKey: false });

module.exports = mongoose.model('VerificationLogs', VerificationLogSchema);
