const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/searchController');

router.get('/activities', ctrl.searchActivities);

module.exports = router;
