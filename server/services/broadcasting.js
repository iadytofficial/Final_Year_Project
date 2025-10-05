const dayjs = require('dayjs');
const Farms = require('../models/Farm');
const TourGuides = require('../models/TourGuide');
const TransportProviders = require('../models/TransportProvider');
const BroadcastRequests = require('../models/BroadcastRequest');
const Bookings = require('../models/Booking');
const { notifyUser } = require('../utils/notify');

function distanceKm(lat1,lng1,lat2,lng2){const R=6371;const dLat=(lat2-lat1)*Math.PI/180;const dLng=(lng2-lng1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(a));}

async function broadcastForBooking(io, bookingId, type) {
  const booking = await Bookings.findById(bookingId);
  const farm = await Farms.findById((await (await Bookings.findById(bookingId)).populate('ActivityID')).ActivityID.FarmID).lean();
  const radius = parseFloat(process.env.BROADCAST_RADIUS_KM || '5');
  const { lat, lng } = farm.Location.coordinates;

  let providers = [];
  if (type === 'Guide') providers = await TourGuides.find({ VerificationStatus: 'Approved' });
  if (type === 'Transport') providers = await TransportProviders.find({ VerificationStatus: 'Approved' });

  const eligible = providers.filter(p => p.Location && p.Location.coordinates && distanceKm(lat, lng, p.Location.coordinates.lat, p.Location.coordinates.lng) <= radius);
  const providerUserIds = eligible.map(p => String(p.UserID));
  const expiresAt = dayjs().add(parseInt(process.env.BROADCAST_TIMEOUT_MINUTES || '30', 10), 'minute').toDate();
  const br = await BroadcastRequests.create({ BookingID: bookingId, ServiceType: type, ProviderUserIDs: providerUserIds, ExpiresAt: expiresAt });

  for (const uid of providerUserIds) {
    await notifyUser(io, String(uid), `New ${type} request available`, 'Booking', bookingId);
    io.to(String(uid)).emit('service:broadcast', { bookingId, type });
  }

  return br;
}

async function accept(io, broadcastId, providerUserId) {
  const br = await BroadcastRequests.findById(broadcastId);
  if (!br || br.Status !== 'Pending') return null;
  br.Status = 'Accepted';
  br.AcceptedByUserID = providerUserId;
  await br.save();
  io.emit('service:accepted', { broadcastId, providerUserId });
  return br;
}

async function expire(io, broadcastId) {
  const br = await BroadcastRequests.findById(broadcastId);
  if (!br || br.Status !== 'Pending') return null;
  br.Status = 'Timeout';
  await br.save();
  io.emit('service:timeout', { broadcastId });
  return br;
}

module.exports = { broadcastForBooking, accept, expire };
