const Images = require('../models/Image');

async function remove(req, res, next) {
  try {
    const id = req.params.imageId;
    await Images.deleteOne({ _id: id, OwnerUserID: req.user.userId });
    return res.json({ message: 'Deleted' });
  } catch (err) { return next(err); }
}

async function reorder(req, res, next) {
  try {
    const { entityType, entityId, order } = req.body; // order: array of imageIds in order
    const images = await Images.find({ OwnerUserID: req.user.userId, EntityType: entityType, EntityID: entityId });
    const orderMap = new Map(order.map((id, idx) => [String(id), idx]));
    await Promise.all(images.map(img => Images.updateOne({ _id: img._id }, { $set: { Order: orderMap.get(String(img._id)) ?? 0 } })));
    return res.json({ message: 'Reordered' });
  } catch (err) { return next(err); }
}

async function setPrimary(req, res, next) {
  try {
    const id = req.params.imageId;
    const img = await Images.findOne({ _id: id, OwnerUserID: req.user.userId });
    if (!img) return res.status(404).json({ code: 'SYS001', message: 'Not found' });
    await Images.updateMany({ OwnerUserID: req.user.userId, EntityType: img.EntityType, EntityID: img.EntityID }, { $set: { IsPrimary: false } });
    await Images.updateOne({ _id: id }, { $set: { IsPrimary: true } });
    return res.json({ message: 'Primary set' });
  } catch (err) { return next(err); }
}

module.exports = { remove, reorder, setPrimary };
