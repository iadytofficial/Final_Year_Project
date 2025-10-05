const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Action: { type: String, required: true },
  EntityType: { type: String, required: true },
  EntityID: { type: mongoose.Schema.Types.ObjectId },
  OldValue: { type: Object },
  NewValue: { type: Object },
  IPAddress: { type: String },
  UserAgent: { type: String },
  Timestamp: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('AuditLogs', AuditLogSchema);
