const Farms = require('../models/Farm');
const Images = require('../models/Image');
const Bookings = require('../models/Booking');
const { upload, scanFile, processImage, uploadsBaseUrl } = require('../utils/uploads');

async function registerFarm(req, res, next) {
  try {
    const { FarmName, FarmType, Description, Location, Facilities } = req.body;
    const farm = await Farms.create({
      UserID: req.user.userId,
      FarmName,
      FarmType,
      Description,
      Location,
      Facilities,
      VerificationStatus: 'Pending',
    });
    return res.status(201).json(farm);
  } catch (err) { return next(err); }
}

async function myFarm(req, res, next) {
  try {
    const farm = await Farms.findOne({ UserID: req.user.userId });
    return res.json(farm || null);
  } catch (err) { return next(err); }
}

async function updateFarm(req, res, next) {
  try {
    const updates = req.body;
    const farm = await Farms.findOneAndUpdate({ UserID: req.user.userId }, updates, { new: true });
    return res.json(farm);
  } catch (err) { return next(err); }
}

async function uploadFarmImages(req, res, next) {
  try {
    const files = req.files || [];
    const base = uploadsBaseUrl(req);
    const farm = await Farms.findOne({ UserID: req.user.userId });
    if (!farm) return res.status(404).json({ code: 'SYS001', message: 'Farm not found' });

    const results = [];
    for (const file of files) {
      await scanFile(file.path);
      const thumbs = await processImage(file.path, base);
      const url = `${base}/${file.filename}`;
      const img = await Images.create({
        OwnerUserID: farm.UserID,
        EntityType: 'Farm',
        EntityID: farm._id,
        Url: url,
        Thumbnail150: thumbs.thumb150,
        Thumbnail300: thumbs.thumb300,
        Thumbnail600: thumbs.thumb600,
        AltText: `${farm.FarmName} image`,
      });
      results.push(img);
    }
    return res.status(201).json({ images: results });
  } catch (err) { return next(err); }
}

async function deleteFarmImage(req, res, next) {
  try {
    const imageId = req.params.imageId;
    const img = await Images.findById(imageId);
    if (!img) return res.status(404).json({ code: 'SYS001', message: 'Image not found' });
    await Images.deleteOne({ _id: imageId });
    return res.json({ message: 'Deleted' });
  } catch (err) { return next(err); }
}

async function dashboardStats(req, res, next) {
  try {
    const farm = await Farms.findOne({ UserID: req.user.userId });
    if (!farm) return res.status(404).json({ code: 'SYS001', message: 'Farm not found' });
    const totalBookings = await Bookings.countDocuments({ ActivityID: { $in: [] } });
    return res.json({ totalBookings });
  } catch (err) { return next(err); }
}

module.exports = { registerFarm, myFarm, updateFarm, uploadFarmImages, deleteFarmImage, dashboardStats, uploadMiddleware: upload.array('images', 10) };
