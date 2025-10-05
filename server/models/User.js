const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  FullName: { type: String, required: true, trim: true },
  Email: { type: String, required: true, unique: true, lowercase: true, index: true },
  Password: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Role: { type: String, enum: ['Tourist','Farmer','TourGuide','TransportProvider','Administrator'], required: true },
  ProfilePic: { type: String },
  CreatedAt: { type: Date, default: Date.now },
  EmailVerified: { type: Boolean, default: false },
  VerificationToken: { type: String },
  FailedLoginAttempts: { type: Number, default: 0 },
  LastLoginAt: { type: Date },
}, { versionKey: false });

module.exports = mongoose.model('Users', UserSchema);
