const mongoose = require('mongoose');

const ActivityTagSchema = new mongoose.Schema({
  CategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCategories', index: true },
  TagName: { type: String, required: true, trim: true },
  IsActive: { type: Boolean, default: true },
}, { versionKey: false });

module.exports = mongoose.model('ActivityTags', ActivityTagSchema);
