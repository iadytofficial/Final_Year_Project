const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/imagesController');

router.delete('/:imageId', requireAuth, ctrl.remove);
router.put('/reorder', requireAuth, ctrl.reorder);
router.put('/:imageId/set-primary', requireAuth, ctrl.setPrimary);

module.exports = router;
