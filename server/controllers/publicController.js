const PublicContent = require('../models/PublicContent');
const Farms = require('../models/Farm');
const Bookings = require('../models/Booking');
const Reviews = require('../models/Review');

async function statistics(req, res, next) {
  try {
    const [farms, bookings, avgRatingAgg] = await Promise.all([
      Farms.countDocuments({ VerificationStatus: 'Approved' }),
      Bookings.countDocuments({ Status: 'Completed' }),
      Reviews.aggregate([{ $group: { _id: null, avg: { $avg: '$Rating' } } }]),
    ]);
    const averageRating = avgRatingAgg.length ? Number(avgRatingAgg[0].avg.toFixed(2)) : 0;
    return res.json({ totalActiveFarms: farms, totalCompletedBookings: bookings, averageRating });
  } catch (err) { return next(err); }
}

async function successStories(req, res, next) {
  try {
    const items = await PublicContent.find({ Type: 'SuccessStory', IsActive: true }).sort({ CreatedAt: -1 });
    return res.json({ items });
  } catch (err) { return next(err); }
}

async function destinations(req, res, next) {
  try {
    const items = await PublicContent.find({ Type: 'Destination', IsActive: true }).sort({ CreatedAt: -1 });
    return res.json({ items });
  } catch (err) { return next(err); }
}

module.exports = { statistics, successStories, destinations };
