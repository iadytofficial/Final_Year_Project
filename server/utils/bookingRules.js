const dayjs = require('dayjs');

function slotStartTime(dateStr, slot) {
  const mapping = { Morning: '09:00', Afternoon: '14:00', Evening: '18:00', FullDay: '08:00' };
  const t = mapping[slot] || '09:00';
  return dayjs(`${dateStr}T${t}:00Z`).toDate();
}

function withinAdvanceWindow(activity, dateStr, slot) {
  const conf = activity.AvailabilityCalendar?.get(dateStr);
  if (!conf) return false;
  const eventTime = dayjs(slotStartTime(dateStr, slot));
  const minLeadHours = 2; // Minimum advance booking window
  if (eventTime.diff(dayjs(), 'hour') < minLeadHours) return false;
  const limitDays = conf.advanceBookingLimitDays || 90;
  if (eventTime.diff(dayjs(), 'day') > limitDays) return false;
  return true;
}

module.exports = { slotStartTime, withinAdvanceWindow };
