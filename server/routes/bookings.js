const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/bookingsController');

router.post('/check-availability', ctrl.checkAvailability);
router.post('/create', requireAuth, requireRole(['Tourist']), ctrl.createBooking);
router.get('/my-bookings', requireAuth, requireRole(['Tourist']), ctrl.myBookings);
router.put('/:bookingId/cancel', requireAuth, requireRole(['Tourist']), ctrl.cancelBooking);
router.post('/:bookingId/cancel', requireAuth, requireRole(['Tourist']), ctrl.cancelBooking);
router.post('/:bookingId/request-cancellation', requireAuth, requireRole(['Tourist']), ctrl.cancelBooking);
router.put('/:bookingId/modify', requireAuth, requireRole(['Tourist']), ctrl.modifyBooking);

module.exports = router;
