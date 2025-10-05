const Messages = require('../models/Message');

async function send(req, res, next) {
  try {
    const { bookingId, receiverId, content } = req.body;
    const msg = await Messages.create({ BookingID: bookingId, SenderID: req.user.userId, ReceiverID: receiverId, Content: content });
    const io = req.app.get('io');
    io.to(String(receiverId)).emit('message:new', { bookingId, from: req.user.userId, content, id: msg._id });
    return res.status(201).json(msg);
  } catch (err) { return next(err); }
}

async function conversation(req, res, next) {
  try {
    const { bookingId } = req.params;
    const list = await Messages.find({ BookingID: bookingId }).sort({ Timestamp: 1 });
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

async function markRead(req, res, next) {
  try {
    const { messageId } = req.params;
    await Messages.updateOne({ _id: messageId, ReceiverID: req.user.userId }, { $set: { IsRead: true } });
    return res.json({ message: 'Read' });
  } catch (err) { return next(err); }
}

module.exports = { send, conversation, markRead };
