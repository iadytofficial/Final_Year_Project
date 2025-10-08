const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');
const Bookings = require('../models/Booking');
const ActivityCategories = require('../models/ActivityCategories');
const ActivityTags = require('../models/ActivityTags');
const Promotions = require('../models/Promotion');

router.use(requireAuth, requireRole(['Administrator']));

router.get('/users', ctrl.listUsers);
router.put('/users/:userId/status', ctrl.setUserStatus);
router.get('/verifications/pending', ctrl.verificationsPending);
router.put('/verify/:providerId', ctrl.verifyProvider);
router.get('/reviews/pending', ctrl.reviewsPending);
router.put('/reviews/:reviewId/moderate', ctrl.moderateReview);
router.get('/feedback', ctrl.listFeedback);
router.put('/feedback/:feedbackId/respond', ctrl.respondFeedback);
router.post('/payouts/process', ctrl.processPayouts);
router.get('/reports/revenue', ctrl.reportRevenue);
router.get('/reports/users', ctrl.reportUsers);
router.get('/reports/bookings', ctrl.reportBookings);

// Added admin bookings endpoints
router.get('/bookings', async (req, res, next) => {
  try { const items = await Bookings.find({}).sort({ BookingDate: -1 }).limit(500); return res.json({ items }); } catch (e) { return next(e); }
});
router.put('/bookings/:id/status', async (req, res, next) => {
  try { await Bookings.updateOne({ _id: req.params.id }, { $set: { Status: req.body.status } }); return res.json({ message: 'OK' }); } catch (e) { return next(e); }
});

// Categories & Tags create
router.post('/categories/create', async (req, res, next) => {
  try { const doc = await ActivityCategories.create({ CategoryName: req.body.CategoryName, Description: req.body.Description||'', IsActive: true }); return res.status(201).json(doc); } catch (e) { return next(e); }
});
router.post('/tags/create', async (req, res, next) => {
  try { const doc = await ActivityTags.create({ CategoryID: req.body.CategoryID, TagName: req.body.TagName, IsActive: true }); return res.status(201).json(doc); } catch (e) { return next(e); }
});

// Promotions CRUD (basic)
router.get('/promotions', async (req, res, next) => {
  try { const items = await Promotions.find({}).sort({ ValidFrom: -1 }); return res.json({ items }); } catch (e) { return next(e); }
});
router.post('/promotions', async (req, res, next) => {
  try { const doc = await Promotions.create(req.body); return res.status(201).json(doc); } catch (e) { return next(e); }
});
router.put('/promotions/:id', async (req, res, next) => {
  try { const doc = await Promotions.findByIdAndUpdate(req.params.id, req.body, { new: true }); return res.json(doc); } catch (e) { return next(e); }
});
router.delete('/promotions/:id', async (req, res, next) => {
  try { await Promotions.deleteOne({ _id: req.params.id }); return res.json({ message: 'Deleted' }); } catch (e) { return next(e); }
});

module.exports = router;
