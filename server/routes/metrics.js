const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/metricsController');

router.get('/', ctrl.metrics);

module.exports = router;
