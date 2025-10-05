const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/farmersController');

router.post('/register-farm', requireAuth, requireRole(['Farmer']), ctrl.registerFarm);
router.get('/my-farm', requireAuth, requireRole(['Farmer']), ctrl.myFarm);
router.put('/update-farm', requireAuth, requireRole(['Farmer']), ctrl.updateFarm);
router.post('/upload-farm-images', requireAuth, requireRole(['Farmer']), ctrl.uploadMiddleware, ctrl.uploadFarmImages);
router.delete('/farm-image/:imageId', requireAuth, requireRole(['Farmer']), ctrl.deleteFarmImage);
router.get('/dashboard-stats', requireAuth, requireRole(['Farmer']), ctrl.dashboardStats);

module.exports = router;
