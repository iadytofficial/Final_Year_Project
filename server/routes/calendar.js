const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/calendarController');

router.get('/availability/:providerId', requireAuth, ctrl.providerAvailability);
router.put('/bulk-update', requireAuth, ctrl.bulkUpdate);
router.get('/blackout-dates', requireAuth, ctrl.blackoutDates);

module.exports = router;
