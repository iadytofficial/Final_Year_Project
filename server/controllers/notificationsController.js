const Notifications = require('../models/Notification');

async function list(req, res, next) {
  try {
    const list = await Notifications.find({ UserID: req.user.userId }).sort({ CreatedAt: -1 }).limit(100);
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

async function read(req, res, next) {
  try {
    const id = req.params.notificationId;
    await Notifications.updateOne({ _id: id, UserID: req.user.userId }, { $set: { IsRead: true } });
    return res.json({ message: 'OK' });
  } catch (err) { return next(err); }
}

async function readAll(req, res, next) {
  try {
    await Notifications.updateMany({ UserID: req.user.userId }, { $set: { IsRead: true } });
    return res.json({ message: 'OK' });
  } catch (err) { return next(err); }
}

module.exports = { list, read, readAll };
