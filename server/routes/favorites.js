const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/favoritesController');

router.post('/add', requireAuth, ctrl.add);
router.delete('/remove', requireAuth, ctrl.remove);
router.get('/list', requireAuth, ctrl.list);

module.exports = router;
