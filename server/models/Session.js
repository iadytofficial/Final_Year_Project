const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  RefreshTokenHash: { type: String, required: true },
  DeviceFingerprint: { type: String },
  IPAddress: { type: String },
  UserAgent: { type: String },
  CreatedAt: { type: Date, default: Date.now },
  LastUsedAt: { type: Date, default: Date.now },
  ExpiresAt: { type: Date, required: true },
}, { versionKey: false });

module.exports = mongoose.model('Sessions', SessionSchema);
