const Joi = require('joi');

const objectId = Joi.string().regex(/^[a-f\d]{24}$/i);

const createActivitySchema = Joi.object({
  FarmID: objectId.required(),
  CategoryID: objectId.required(),
  TagIDs: Joi.array().items(objectId),
  CustomTitle: Joi.string().min(3).max(200).required(),
  CustomDescription: Joi.string().allow(''),
  PricePerPerson: Joi.number().positive().precision(2).required(),
  DurationHours: Joi.number().min(0).max(72).default(0),
  MaxParticipants: Joi.number().integer().min(1).required(),
});

const updateActivitySchema = Joi.object({
  CustomTitle: Joi.string().min(3).max(200),
  CustomDescription: Joi.string().allow(''),
  PricePerPerson: Joi.number().positive().precision(2),
  DurationHours: Joi.number().min(0).max(72),
  MaxParticipants: Joi.number().integer().min(1),
  Status: Joi.string().valid('Active','Inactive'),
});

const availabilitySchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  capacityPerSlot: Joi.number().integer().min(0).required(),
  slots: Joi.object({
    Morning: Joi.number().integer().min(0).required(),
    Afternoon: Joi.number().integer().min(0).required(),
    Evening: Joi.number().integer().min(0).required(),
    FullDay: Joi.number().integer().min(0).required(),
  }).required(),
  blackout: Joi.array().items(Joi.string()),
  lastMinuteEnabled: Joi.boolean(),
  advanceBookingLimitDays: Joi.number().integer().min(1).max(180),
});

module.exports = { createActivitySchema, updateActivitySchema, availabilitySchema };
