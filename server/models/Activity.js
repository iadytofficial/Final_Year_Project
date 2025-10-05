const mongoose = require('mongoose');

const AvailabilitySlotSchema = new mongoose.Schema({
  capacityPerSlot: { type: Number, default: 0 },
  lastMinuteEnabled: { type: Boolean, default: false },
  advanceBookingLimitDays: { type: Number, default: 90 },
  blackout: [{ type: String }], // YYYY-MM-DD
  slots: {
    Morning: { type: Number, default: 0 },
    Afternoon: { type: Number, default: 0 },
    Evening: { type: Number, default: 0 },
    FullDay: { type: Number, default: 0 },
  },
  seasonalRules: { type: Object },
  recurringRules: { type: Object },
  holidayRules: { type: Object },
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
  FarmID: { type: mongoose.Schema.Types.ObjectId, ref: 'Farms', index: true },
  CategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCategories', index: true },
  TagIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActivityTags' }],
  CustomTitle: { type: String, required: true },
  Status: { type: String, enum: ['Active','Inactive'], default: 'Active' },
  CustomDescription: { type: String },
  PricePerPerson: { type: Number, required: true },
  DurationHours: { type: Number, default: 0 },
  MaxParticipants: { type: Number, default: 0 },
  Images: [{ type: String }],
  AvailabilityCalendar: {
    type: Map,
    of: AvailabilitySlotSchema,
    default: {},
  },
}, { versionKey: false });

module.exports = mongoose.model('Activities', ActivitySchema);
