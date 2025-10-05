const Joi = require('joi');

const objectId = Joi.string().regex(/^[a-f\d]{24}$/i);
const slot = Joi.string().valid('Morning','Afternoon','Evening','FullDay');

const checkAvailabilitySchema = Joi.object({
  activityId: objectId.required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  slot: slot.required(),
  participants: Joi.number().integer().min(1).required(),
});

const createBookingSchema = Joi.object({
  activityId: objectId.required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  slot: slot.required(),
  participants: Joi.number().integer().min(1).required(),
  requestGuide: Joi.boolean().default(false),
  requestTransport: Joi.boolean().default(false),
  specialRequests: Joi.string().allow(''),
});

module.exports = { checkAvailabilitySchema, createBookingSchema };
