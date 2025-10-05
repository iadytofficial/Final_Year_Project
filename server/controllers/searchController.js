const Activities = require('../models/Activity');
const Farms = require('../models/Farm');

async function searchActivities(req, res, next) {
  try {
    const { location, category, tags, date, participants, priceMin, priceMax } = req.query;

    const farmMatch = {};
    if (location) {
      const [lat, lng, radiusKm] = location.split(',').map(Number);
      farmMatch.Geo = { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: (radiusKm || 50) * 1000 } };
    }
    const farms = await Farms.find(farmMatch).select('_id');
    const farmIds = farms.map(f => f._id);

    const match = { Status: 'Active' };
    if (farmIds.length) match.FarmID = { $in: farmIds };
    if (category) match.CategoryID = category;
    if (tags) match.TagIDs = { $all: (Array.isArray(tags) ? tags : String(tags).split(',')) };
    if (priceMin || priceMax) match.PricePerPerson = { ...(priceMin ? { $gte: Number(priceMin) } : {}), ...(priceMax ? { $lte: Number(priceMax) } : {}) };

    const list = await Activities.find(match).limit(50);

    // Date availability filtering
    let filtered = list;
    if (date && participants) {
      filtered = list.filter(a => {
        const conf = a.AvailabilityCalendar.get(date);
        if (!conf) return false;
        const cap = conf.capacityPerSlot || 0;
        return Number(participants) <= cap;
      });
    }

    return res.json({ items: filtered });
  } catch (err) { return next(err); }
}

module.exports = { searchActivities };
