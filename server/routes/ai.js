const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aiController');

router.post('/identify-plant', ctrl.identify);
router.post('/chatbot', ctrl.chat);

module.exports = router;
