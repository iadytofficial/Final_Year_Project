const dayjs = require('dayjs');

function isFutureDate(dateStr) {
  return dayjs(dateStr).isAfter(dayjs(), 'day');
}

function canBookDate(activity, dateStr, participants) {
  const conf = activity.AvailabilityCalendar?.get(dateStr);
  if (!conf) return false;
  if (conf.blackout && conf.blackout.includes(dateStr)) return false;
  const max = conf.capacityPerSlot || 0;
  return participants <= max;
}

module.exports = { isFutureDate, canBookDate };
