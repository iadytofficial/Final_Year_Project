const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/publicController');

router.get('/statistics', ctrl.statistics);
router.get('/success-stories', ctrl.successStories);
router.get('/destinations', ctrl.destinations);

module.exports = router;
