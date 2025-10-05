const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  BookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', index: true },
  ReviewerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Rating: { type: Number, min: 1, max: 5, required: true },
  Comment: { type: String, maxlength: 500 },
  ModerationStatus: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  ModeratorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  CreatedAt: { type: Date, default: Date.now },
  Images: [{ type: String }],
  SubRatings: {
    Authenticity: { type: Number, min: 1, max: 5 },
    ValueForMoney: { type: Number, min: 1, max: 5 },
    HostCommunication: { type: Number, min: 1, max: 5 },
    Cleanliness: { type: Number, min: 1, max: 5 },
    Location: { type: Number, min: 1, max: 5 },
  },
}, { versionKey: false });

module.exports = mongoose.model('Reviews', ReviewSchema);
