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
router.put('/:bookingId/modify', requireAuth, requireRole(['Tourist']), async (req, res, next) => {
  try {
    const { ActivityDate, NumberOfParticipants } = req.body
    const b = await require('../models/Booking').findOne({ _id: req.params.bookingId, TouristID: req.user.userId })
    if (!b) return res.status(404).json({ code: 'SYS001', message: 'Booking not found' })
    b.ActivityDate = new Date(ActivityDate)
    b.NumberOfParticipants = Number(NumberOfParticipants)
    await b.save()
    return res.json({ message: 'Modification requested' })
  } catch (e) { return next(e) }
});

module.exports = router;
