const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/activitiesController');

router.post('/create', requireAuth, requireRole(['Farmer']), ctrl.createActivity);
router.get('/my-activities', requireAuth, requireRole(['Farmer']), ctrl.myActivities);
router.get('/:activityId', ctrl.getActivity);
router.put('/:activityId', requireAuth, requireRole(['Farmer']), ctrl.updateActivity);
router.delete('/:activityId', requireAuth, requireRole(['Farmer']), ctrl.deleteActivity);
router.post('/:activityId/upload-images', requireAuth, requireRole(['Farmer']), ctrl.uploadMiddleware, ctrl.uploadActivityImages);
router.put('/:activityId/availability', requireAuth, requireRole(['Farmer']), ctrl.updateAvailability);
router.get('/categories', ctrl.listCategories);
router.get('/tags/:categoryId', ctrl.listTags);

module.exports = router;
