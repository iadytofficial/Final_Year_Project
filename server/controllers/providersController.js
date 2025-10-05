const TourGuides = require('../models/TourGuide');
const TransportProviders = require('../models/TransportProvider');
const Payments = require('../models/Payment');
const Bookings = require('../models/Booking');

async function registerGuide(req, res, next) {
  try {
    const guide = await TourGuides.create({ UserID: req.user.userId, ...req.body, VerificationStatus: 'Pending' });
    return res.status(201).json(guide);
  } catch (err) { return next(err); }
}

async function guideProfile(req, res, next) {
  try {
    const guide = await TourGuides.findOne({ UserID: req.user.userId });
    return res.json(guide || null);
  } catch (err) { return next(err); }
}

async function updateGuide(req, res, next) {
  try {
    const updated = await TourGuides.findOneAndUpdate({ UserID: req.user.userId }, req.body, { new: true });
    return res.json(updated);
  } catch (err) { return next(err); }
}

async function guideAvailability(req, res, next) {
  try {
    const guide = await TourGuides.findOneAndUpdate({ UserID: req.user.userId }, { $set: { AvailabilityCalendar: req.body.dates || [] } }, { new: true });
    return res.json(guide);
  } catch (err) { return next(err); }
}

async function guideRequests(req, res, next) {
  try {
    // Stub for now; would pull from broadcast requests
    return res.json({ items: [] });
  } catch (err) { return next(err); }
}

async function guideRespond(req, res, next) {
  try {
    return res.json({ message: 'OK' });
  } catch (err) { return next(err); }
}

async function guideEarnings(req, res, next) {
  try {
    const sum = await Payments.aggregate([{ $match: { Status: 'Success' } }, { $group: { _id: null, total: { $sum: '$Amount' } } }]);
    return res.json({ total: sum.length ? sum[0].total : 0 });
  } catch (err) { return next(err); }
}

async function registerTransport(req, res, next) {
  try {
    const tr = await TransportProviders.create({ UserID: req.user.userId, ...req.body, VerificationStatus: 'Pending' });
    return res.status(201).json(tr);
  } catch (err) { return next(err); }
}

async function transportProfile(req, res, next) {
  try {
    const tr = await TransportProviders.findOne({ UserID: req.user.userId });
    return res.json(tr || null);
  } catch (err) { return next(err); }
}

async function updateTransport(req, res, next) {
  try {
    const updated = await TransportProviders.findOneAndUpdate({ UserID: req.user.userId }, req.body, { new: true });
    return res.json(updated);
  } catch (err) { return next(err); }
}

async function transportAvailability(req, res, next) {
  try {
    const tr = await TransportProviders.findOneAndUpdate({ UserID: req.user.userId }, { $set: { AvailabilityCalendar: req.body.dates || [] } }, { new: true });
    return res.json(tr);
  } catch (err) { return next(err); }
}

async function transportRequests(req, res, next) {
  try {
    return res.json({ items: [] });
  } catch (err) { return next(err); }
}

async function transportRespond(req, res, next) {
  try {
    return res.json({ message: 'OK' });
  } catch (err) { return next(err); }
}

async function transportEarnings(req, res, next) {
  try {
    const sum = await Payments.aggregate([{ $match: { Status: 'Success' } }, { $group: { _id: null, total: { $sum: '$Amount' } } }]);
    return res.json({ total: sum.length ? sum[0].total : 0 });
  } catch (err) { return next(err); }
}

module.exports = { registerGuide, guideProfile, updateGuide, guideAvailability, guideRequests, guideRespond, guideEarnings, registerTransport, transportProfile, updateTransport, transportAvailability, transportRequests, transportRespond, transportEarnings };
