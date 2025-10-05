const Joi = require('joi');

const email = Joi.string().email({ tlds: { allow: false } }).required();
const password = Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[!@#$%^&*(),.?":{}|<>]/).required();
const phone = Joi.string().pattern(/^\+?\d{9,15}$/).required();
const role = Joi.string().valid('Tourist','Farmer','TourGuide','TransportProvider','Administrator').required();

const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email,
  password,
  phoneNumber: phone,
  role,
});

const loginSchema = Joi.object({ email, password: Joi.string().required() });

module.exports = { registerSchema, loginSchema };
