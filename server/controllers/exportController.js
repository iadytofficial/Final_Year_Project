const { Parser } = require('json2csv');
const Bookings = require('../models/Booking');
const Payments = require('../models/Payment');
const Users = require('../models/User');
const Reviews = require('../models/Review');

function toCsv(items) {
  const parser = new Parser();
  return parser.parse(items);
}

async function exportBookings(req, res, next) {
  try {
    const items = await Bookings.find({}).lean();
    return sendExport(res, items);
  } catch (err) { return next(err); }
}

async function exportEarnings(req, res, next) {
  try {
    const items = await Payments.find({ Status: 'Success' }).lean();
    return sendExport(res, items);
  } catch (err) { return next(err); }
}

async function exportUsers(req, res, next) {
  try {
    const items = await Users.find({}).lean();
    return sendExport(res, items);
  } catch (err) { return next(err); }
}

async function exportReviews(req, res, next) {
  try {
    const items = await Reviews.find({}).lean();
    return sendExport(res, items);
  } catch (err) { return next(err); }
}

function sendExport(res, items) {
  const format = (res.req.query.format || 'csv').toLowerCase();
  if (format === 'json') {
    return res.json({ items });
  }
  const csv = toCsv(items);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
  return res.send(csv);
}

module.exports = { exportBookings, exportEarnings, exportUsers, exportReviews };
