const Activities = require('../models/Activity');
const Farms = require('../models/Farm');

async function providerAvailability(req, res, next) {
  try {
    const providerId = req.params.providerId;
    const farms = await Farms.find({ UserID: providerId }).select('_id');
    const activities = await Activities.find({ FarmID: { $in: farms.map(f => f._id) } }).select('CustomTitle AvailabilityCalendar');
    return res.json({ items: activities });
  } catch (err) { return next(err); }
}

async function bulkUpdate(req, res, next) {
  try {
    const { activityId, dates, payload } = req.body; // dates: ['YYYY-MM-DD'], payload same as availability update
    const activity = await Activities.findById(activityId);
    const farm = await Farms.findOne({ _id: activity.FarmID, UserID: req.user.userId });
    if (!farm) return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    for (const d of dates) {
      activity.AvailabilityCalendar.set(d, payload);
    }
    await activity.save();
    return res.json({ message: 'Bulk update complete' });
  } catch (err) { return next(err); }
}

async function blackoutDates(req, res, next) {
  try {
    const { activityId } = req.query;
    const activity = await Activities.findById(activityId);
    if (!activity) return res.status(404).json({ code: 'SYS001', message: 'Not found' });
    const dates = [];
    for (const [d, conf] of activity.AvailabilityCalendar.entries()) {
      if (conf.blackout && conf.blackout.includes(d)) dates.push(d);
    }
    return res.json({ dates });
  } catch (err) { return next(err); }
}

module.exports = { providerAvailability, bulkUpdate, blackoutDates };
