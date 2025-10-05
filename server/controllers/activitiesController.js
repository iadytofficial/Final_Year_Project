const Activities = require('../models/Activity');
const Farms = require('../models/Farm');
const Images = require('../models/Image');
const { upload, scanFile, processImage, uploadsBaseUrl } = require('../utils/uploads');
const { createActivitySchema, updateActivitySchema, availabilitySchema } = require('../validators/activityValidators');

async function createActivity(req, res, next) {
  try {
    const { value, error } = createActivitySchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const farm = await Farms.findOne({ _id: value.FarmID, UserID: req.user.userId });
    if (!farm) return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    const activity = await Activities.create(value);
    return res.status(201).json(activity);
  } catch (err) { return next(err); }
}

async function myActivities(req, res, next) {
  try {
    const farms = await Farms.find({ UserID: req.user.userId }).select('_id');
    const farmIds = farms.map(f => f._id);
    const list = await Activities.find({ FarmID: { $in: farmIds } });
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

async function getActivity(req, res, next) {
  try {
    const activity = await Activities.findById(req.params.activityId);
    if (!activity) return res.status(404).json({ code: 'SYS001', message: 'Not found' });
    return res.json(activity);
  } catch (err) { return next(err); }
}

async function updateActivity(req, res, next) {
  try {
    const { value, error } = updateActivitySchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const activity = await Activities.findById(req.params.activityId);
    const farm = await Farms.findOne({ _id: activity.FarmID, UserID: req.user.userId });
    if (!farm) return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    const updated = await Activities.findByIdAndUpdate(activity._id, value, { new: true });
    return res.json(updated);
  } catch (err) { return next(err); }
}

async function deleteActivity(req, res, next) {
  try {
    const activity = await Activities.findById(req.params.activityId);
    const farm = await Farms.findOne({ _id: activity.FarmID, UserID: req.user.userId });
    if (!farm) return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    await Activities.deleteOne({ _id: activity._id });
    return res.json({ message: 'Deleted' });
  } catch (err) { return next(err); }
}

async function uploadActivityImages(req, res, next) {
  try {
    const activity = await Activities.findById(req.params.activityId);
    const farm = await Farms.findOne({ _id: activity.FarmID, UserID: req.user.userId });
    if (!farm) return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    const files = req.files || [];
    const base = uploadsBaseUrl(req);
    const results = [];
    for (const file of files) {
      await scanFile(file.path);
      const thumbs = await processImage(file.path, base);
      const url = `${base}/${file.filename}`;
      const img = await Images.create({
        OwnerUserID: req.user.userId,
        EntityType: 'Activity',
        EntityID: activity._id,
        Url: url,
        Thumbnail150: thumbs.thumb150,
        Thumbnail300: thumbs.thumb300,
        Thumbnail600: thumbs.thumb600,
        AltText: `${activity.CustomTitle} image`,
      });
      results.push(img);
    }
    return res.status(201).json({ images: results });
  } catch (err) { return next(err); }
}

async function updateAvailability(req, res, next) {
  try {
    const { value, error } = availabilitySchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const activity = await Activities.findById(req.params.activityId);
    const farm = await Farms.findOne({ _id: activity.FarmID, UserID: req.user.userId });
    if (!farm) return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    activity.AvailabilityCalendar.set(value.date, {
      capacityPerSlot: value.capacityPerSlot,
      slots: value.slots,
      blackout: value.blackout || [],
      lastMinuteEnabled: value.lastMinuteEnabled || false,
      advanceBookingLimitDays: value.advanceBookingLimitDays || 90,
    });
    await activity.save();
    return res.json({ message: 'Availability updated' });
  } catch (err) { return next(err); }
}

module.exports = {
  createActivity,
  myActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  uploadActivityImages,
  updateAvailability,
  uploadMiddleware: upload.array('images', 10),
};
