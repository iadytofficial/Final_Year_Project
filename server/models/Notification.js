const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
  Message: { type: String, required: true },
  Type: { type: String, enum: ['Booking','Payment','Review','System'], index: true },
  RelatedID: { type: mongoose.Schema.Types.ObjectId },
  IsRead: { type: Boolean, default: false },
  CreatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('Notifications', NotificationSchema);
