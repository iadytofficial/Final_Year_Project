const Favorites = require('../models/Favorite');

async function add(req, res, next) {
  try {
    const { activityId } = req.body;
    const f = await Favorites.findOneAndUpdate({ UserID: req.user.userId, ActivityID: activityId }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.status(201).json(f);
  } catch (err) { return next(err); }
}

async function remove(req, res, next) {
  try {
    const { activityId } = req.body;
    await Favorites.deleteOne({ UserID: req.user.userId, ActivityID: activityId });
    return res.json({ message: 'Removed' });
  } catch (err) { return next(err); }
}

async function list(req, res, next) {
  try {
    const list = await Favorites.find({ UserID: req.user.userId }).sort({ CreatedAt: -1 });
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

module.exports = { add, remove, list };
