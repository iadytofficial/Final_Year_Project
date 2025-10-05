const Users = require('../models/User');
const VerificationLogs = require('../models/VerificationLog');
const Reviews = require('../models/Review');
const Feedback = require('../models/Feedback');
const Payouts = require('../models/Payout');
const Payments = require('../models/Payment');
const Bookings = require('../models/Booking');

async function listUsers(req, res, next) {
  try {
    const users = await Users.find({}).limit(200);
    return res.json({ items: users });
  } catch (err) { return next(err); }
}

async function setUserStatus(req, res, next) {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    await Users.updateOne({ _id: userId }, { $set: { Status: status } });
    return res.json({ message: 'Updated' });
  } catch (err) { return next(err); }
}

async function verificationsPending(req, res, next) {
  try {
    const users = await Users.find({ Role: { $in: ['Farmer','TourGuide','TransportProvider'] }, Status: 'Active' }).limit(200);
    return res.json({ items: users });
  } catch (err) { return next(err); }
}

async function verifyProvider(req, res, next) {
  try {
    const { providerId } = req.params;
    const { action, comments, documents } = req.body;
    await VerificationLogs.create({ ProviderUserID: providerId, AdminUserID: req.user.userId, Action: action === 'approve' ? 'Approved' : 'Rejected', Comments: comments || '', DocumentsVerified: documents || [] });
    return res.json({ message: 'Logged' });
  } catch (err) { return next(err); }
}

async function reviewsPending(req, res, next) {
  try {
    const items = await Reviews.find({ ModerationStatus: 'Pending' }).limit(100);
    return res.json({ items });
  } catch (err) { return next(err); }
}

async function moderateReview(req, res, next) {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;
    await Reviews.updateOne({ _id: reviewId }, { $set: { ModerationStatus: status, ModeratorID: req.user.userId } });
    return res.json({ message: 'OK' });
  } catch (err) { return next(err); }
}

async function listFeedback(req, res, next) {
  try {
    const items = await Feedback.find({}).sort({ SubmittedAt: -1 }).limit(200);
    return res.json({ items });
  } catch (err) { return next(err); }
}

async function respondFeedback(req, res, next) {
  try {
    const { feedbackId } = req.params;
    const { response } = req.body;
    await Feedback.updateOne({ _id: feedbackId }, { $set: { AdminResponse: response, RespondedAt: new Date(), Status: 'InProgress' } });
    return res.json({ message: 'OK' });
  } catch (err) { return next(err); }
}

async function processPayouts(req, res, next) {
  try {
    const { userId, paymentIds } = req.body;
    const payments = await Payments.find({ _id: { $in: paymentIds } });
    const amount = payments.reduce((a, p) => a + p.Amount, 0);
    const payout = await Payouts.create({ UserID: userId, Amount: amount, PaymentIDs: paymentIds, Status: 'Pending' });
    await Payments.updateMany({ _id: { $in: paymentIds } }, { $set: { PayoutID: payout._id } });
    return res.json({ payoutId: payout._id });
  } catch (err) { return next(err); }
}

async function reportRevenue(req, res, next) {
  try {
    const agg = await Payments.aggregate([
      { $match: { Status: 'Success' } },
      { $group: { _id: { $month: '$PaymentDate' }, total: { $sum: '$Amount' } } },
      { $sort: { '_id': 1 } },
    ]);
    return res.json({ items: agg });
  } catch (err) { return next(err); }
}

async function reportUsers(req, res, next) {
  try {
    const agg = await Users.aggregate([
      { $group: { _id: '$Role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.json({ items: agg });
  } catch (err) { return next(err); }
}

async function reportBookings(req, res, next) {
  try {
    const agg = await Bookings.aggregate([
      { $group: { _id: { $month: '$BookingDate' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]);
    return res.json({ items: agg });
  } catch (err) { return next(err); }
}

module.exports = { listUsers, setUserStatus, verificationsPending, verifyProvider, reviewsPending, moderateReview, listFeedback, respondFeedback, processPayouts, reportRevenue, reportUsers, reportBookings };
