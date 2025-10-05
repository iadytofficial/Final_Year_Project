const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema({
  LogLevel: { type: String, enum: ['ERROR','WARN','INFO','DEBUG'], required: true },
  Message: { type: String, required: true },
  Stack: { type: String },
  Metadata: { type: Object },
  Timestamp: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('SystemLogs', SystemLogSchema);
