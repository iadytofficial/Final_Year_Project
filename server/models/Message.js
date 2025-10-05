const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  BookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', index: true },
  SenderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  ReceiverID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Content: { type: String, required: true },
  Timestamp: { type: Date, default: Date.now },
  IsRead: { type: Boolean, default: false },
}, { versionKey: false });

module.exports = mongoose.model('Messages', MessageSchema);
