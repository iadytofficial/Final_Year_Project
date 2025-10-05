const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/notificationsController');

router.get('/', requireAuth, ctrl.list);
router.put('/:notificationId/read', requireAuth, ctrl.read);
router.put('/read-all', requireAuth, ctrl.readAll);

module.exports = router;
