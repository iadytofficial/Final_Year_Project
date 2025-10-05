const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

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

module.exports = router;
