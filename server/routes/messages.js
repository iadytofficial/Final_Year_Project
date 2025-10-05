const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/messagingController');

router.post('/send', requireAuth, ctrl.send);
router.get('/conversation/:bookingId', requireAuth, ctrl.conversation);
router.put('/:messageId/read', requireAuth, ctrl.markRead);

module.exports = router;
