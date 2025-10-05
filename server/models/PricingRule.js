const mongoose = require('mongoose');

const PricingRuleSchema = new mongoose.Schema({
  ActivityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Activities', index: true },
  Rules: { type: Object },
  ValidFrom: { type: Date },
  ValidTo: { type: Date },
}, { versionKey: false });

module.exports = mongoose.model('PricingRules', PricingRuleSchema);
