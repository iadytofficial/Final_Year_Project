const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  Code: { type: String, unique: true, required: true },
  Type: { type: String, enum: ['Percentage','Fixed'], required: true },
  Value: { type: Number, required: true },
  ValidFrom: { type: Date, required: true },
  ValidTo: { type: Date, required: true },
  UsageLimit: { type: Number, default: 0 },
  UsedCount: { type: Number, default: 0 },
  ApplicableTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activities' }],
}, { versionKey: false });

module.exports = mongoose.model('Promotions', PromotionSchema);
