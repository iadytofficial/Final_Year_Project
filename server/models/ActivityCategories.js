const mongoose = require('mongoose');

const ActivityCategorySchema = new mongoose.Schema({
  CategoryName: { type: String, unique: true, required: true, trim: true },
  Description: { type: String },
  IsActive: { type: Boolean, default: true },
}, { versionKey: false });

module.exports = mongoose.model('ActivityCategories', ActivityCategorySchema);
