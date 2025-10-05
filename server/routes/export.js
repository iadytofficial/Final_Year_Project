const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/exportController');

router.get('/bookings', requireAuth, requireRole(['Administrator']), ctrl.exportBookings);
router.get('/earnings', requireAuth, requireRole(['Administrator']), ctrl.exportEarnings);
router.get('/users', requireAuth, requireRole(['Administrator']), ctrl.exportUsers);
router.get('/reviews', requireAuth, requireRole(['Administrator']), ctrl.exportReviews);

module.exports = router;
