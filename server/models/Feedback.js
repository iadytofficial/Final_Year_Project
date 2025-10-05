const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Category: { type: String, enum: ['Bug','Feature','Complaint','Other'], required: true },
  Message: { type: String, required: true },
  Status: { type: String, enum: ['Open','InProgress','Resolved'], default: 'Open' },
  SubmittedAt: { type: Date, default: Date.now },
  AdminResponse: { type: String },
  RespondedAt: { type: Date },
}, { versionKey: false });

module.exports = mongoose.model('Feedback', FeedbackSchema);
