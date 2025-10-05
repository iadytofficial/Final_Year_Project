const Reviews = require('../models/Review');
const Bookings = require('../models/Booking');

async function create(req, res, next) {
  try {
    const { bookingId, rating, comment, subRatings } = req.body;
    const booking = await Bookings.findOne({ _id: bookingId, TouristID: req.user.userId });
    if (!booking) return res.status(404).json({ code: 'SYS001', message: 'Booking not found' });
    if (new Date(booking.ActivityDate) > new Date()) return res.status(400).json({ code: 'VAL001', message: 'Review allowed after completion' });
    const review = await Reviews.create({ BookingID: booking._id, ReviewerID: req.user.userId, Rating: rating, Comment: comment || '', SubRatings: subRatings });
    return res.status(201).json(review);
  } catch (err) { return next(err); }
}

async function myReviews(req, res, next) {
  try {
    const list = await Reviews.find({ ReviewerID: req.user.userId }).sort({ CreatedAt: -1 });
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

module.exports = { create, myReviews };
