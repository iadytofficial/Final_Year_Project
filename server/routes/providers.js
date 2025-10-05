const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/providersController');

// Tour Guide
router.post('/guides/register', requireAuth, requireRole(['TourGuide']), ctrl.registerGuide);
router.get('/guides/profile', requireAuth, requireRole(['TourGuide']), ctrl.guideProfile);
router.put('/guides/profile', requireAuth, requireRole(['TourGuide']), ctrl.updateGuide);
router.put('/guides/availability', requireAuth, requireRole(['TourGuide']), ctrl.guideAvailability);
router.get('/guides/booking-requests', requireAuth, requireRole(['TourGuide']), ctrl.guideRequests);
router.put('/guides/booking/:bookingId/respond', requireAuth, requireRole(['TourGuide']), ctrl.guideRespond);
router.get('/guides/earnings', requireAuth, requireRole(['TourGuide']), ctrl.guideEarnings);

// Transport
router.post('/transport/register', requireAuth, requireRole(['TransportProvider']), ctrl.registerTransport);
router.get('/transport/profile', requireAuth, requireRole(['TransportProvider']), ctrl.transportProfile);
router.put('/transport/profile', requireAuth, requireRole(['TransportProvider']), ctrl.updateTransport);
router.put('/transport/availability', requireAuth, requireRole(['TransportProvider']), ctrl.transportAvailability);
router.get('/transport/trip-requests', requireAuth, requireRole(['TransportProvider']), ctrl.transportRequests);
router.put('/transport/trip/:bookingId/respond', requireAuth, requireRole(['TransportProvider']), ctrl.transportRespond);
router.get('/transport/earnings', requireAuth, requireRole(['TransportProvider']), ctrl.transportEarnings);

module.exports = router;
