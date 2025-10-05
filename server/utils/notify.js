const Notifications = require('../models/Notification');

async function notifyUser(io, userId, message, type, relatedId) {
  const n = await Notifications.create({ UserID: userId, Message: message, Type: type, RelatedID: relatedId });
  if (io) io.to(String(userId)).emit('notification:new', { id: n._id, message, type, relatedId });
  return n;
}

module.exports = { notifyUser };
