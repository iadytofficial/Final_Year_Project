const dayjs = require('dayjs');
const Activities = require('../models/Activity');
const Farms = require('../models/Farm');
const Bookings = require('../models/Booking');
const { checkAvailabilitySchema, createBookingSchema } = require('../validators/bookingValidators');
const { withinAdvanceWindow } = require('../utils/bookingRules');
const { notifyUser } = require('../utils/notify');

async function computeRemaining(activity, date, slot) {
  const conf = activity.AvailabilityCalendar?.get(date);
  if (!conf) return { capacity: 0, remaining: 0 };
  const capacity = conf.slots?.[slot] || 0;
  const existing = await Bookings.aggregate([
    { $match: { ActivityID: activity._id, ActivityDate: new Date(date), Slot: slot, Status: { $in: ['Pending','Confirmed'] } } },
    { $group: { _id: null, total: { $sum: '$NumberOfParticipants' } } },
  ]);
  const used = existing.length ? existing[0].total : 0;
  const remaining = Math.max(0, capacity - used);
  return { capacity, remaining };
}

async function checkAvailability(req, res, next) {
  try {
    const { value, error } = checkAvailabilitySchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const { activityId, date, slot, participants } = value;
    const activity = await Activities.findById(activityId);
    if (!activity || activity.Status !== 'Active') return res.status(404).json({ code: 'SYS001', message: 'Activity not found' });
    if (!withinAdvanceWindow(activity, date, slot)) return res.status(400).json({ code: 'BOOK002', message: 'Invalid date or lead time' });
    const { capacity, remaining } = await computeRemaining(activity, date, slot);
    return res.json({ available: remaining >= participants, capacity, remaining });
  } catch (err) { return next(err); }
}

async function createBooking(req, res, next) {
  try {
    const { value, error } = createBookingSchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const { activityId, date, slot, participants, requestGuide, requestTransport, specialRequests } = value;
    const activity = await Activities.findById(activityId);
    if (!activity || activity.Status !== 'Active') return res.status(404).json({ code: 'SYS001', message: 'Activity not found' });
    if (!withinAdvanceWindow(activity, date, slot)) return res.status(400).json({ code: 'BOOK002', message: 'Invalid date or lead time' });
    const { remaining } = await computeRemaining(activity, date, slot);
    if (participants > remaining) return res.status(409).json({ code: 'BOOK001', message: 'Slot unavailable' });

    const total = Number((participants * activity.PricePerPerson).toFixed(2));
    const guideStatus = requestGuide ? 'Pending' : 'NotRequested';
    const transportStatus = requestTransport ? 'Pending' : 'NotRequested';

    const booking = await Bookings.create({
      TouristID: req.user.userId,
      ActivityID: activity._id,
      ActivityDate: new Date(date),
      Slot: slot,
      NumberOfParticipants: participants,
      TotalCost: total,
      Status: 'Pending',
      GuideStatus: guideStatus,
      TransportStatus: transportStatus,
      SpecialRequests: specialRequests || '',
    });

    // Notify farmer
    const farm = await Farms.findById(activity.FarmID).select('UserID');
    const io = req.app.get('io');
    await notifyUser(io, String(farm.UserID), 'New booking request received', 'Booking', booking._id);

    return res.status(201).json({ bookingId: booking._id, status: booking.Status, total });
  } catch (err) { return next(err); }
}

async function myBookings(req, res, next) {
  try {
    const list = await Bookings.find({ TouristID: req.user.userId }).sort({ BookingDate: -1 });
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

async function cancelBooking(req, res, next) {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Bookings.findOne({ _id: bookingId, TouristID: req.user.userId });
    if (!booking) return res.status(404).json({ code: 'SYS001', message: 'Booking not found' });
    if (booking.Status === 'Cancelled') return res.json({ message: 'Already cancelled' });

    // Apply cancellation policy at payments stage; mark cancelled
    booking.Status = 'Cancelled';
    booking.CancellationRequested = true;
    booking.CancellationReason = req.body?.reason || '';
    await booking.save();

    // Notify farmer
    const activity = await Activities.findById(booking.ActivityID);
    const farm = await Farms.findById(activity.FarmID).select('UserID');
    const io = req.app.get('io');
    await notifyUser(io, String(farm.UserID), 'A booking was cancelled', 'Booking', booking._id);

    return res.json({ message: 'Cancellation requested' });
  } catch (err) { return next(err); }
}

module.exports = { checkAvailability, createBooking, myBookings, cancelBooking };
