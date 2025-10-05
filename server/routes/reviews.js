const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/reviewsController');

router.post('/create', requireAuth, requireRole(['Tourist']), ctrl.create);
router.get('/my-reviews', requireAuth, requireRole(['Tourist']), ctrl.myReviews);

module.exports = router;
