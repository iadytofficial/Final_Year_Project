const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentsController');
const { requireAuth } = require('../middleware/auth');

router.post('/create-intent', requireAuth, ctrl.createIntent);
router.post('/confirm', requireAuth, ctrl.confirm);
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);
router.get('/history', requireAuth, ctrl.history);
router.post('/refund/:paymentId', requireAuth, ctrl.refund);

module.exports = router;
