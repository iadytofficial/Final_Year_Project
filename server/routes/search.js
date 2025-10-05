const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/searchController');
const Searches = require('../models/Search');

router.get('/activities', ctrl.searchActivities);

router.get('/suggestions', async (req, res, next) => {
  try {
    const items = await Searches.find({}).sort({ Popularity: -1 }).limit(10);
    res.json({ items });
  } catch (e) { next(e); }
});

router.get('/popular', async (req, res, next) => {
  try {
    const items = await Searches.find({}).sort({ Popularity: -1 }).limit(10);
    res.json({ items });
  } catch (e) { next(e); }
});

router.post('/save', async (req, res, next) => {
  try {
    const s = await Searches.create({ UserID: req.user?.userId || null, Query: req.body || {}, Popularity: 1 });
    res.status(201).json(s);
  } catch (e) { next(e); }
});

router.get('/saved', async (req, res, next) => {
  try {
    const items = await Searches.find({ UserID: req.user?.userId || null }).sort({ CreatedAt: -1 });
    res.json({ items });
  } catch (e) { next(e); }
});

module.exports = router;
