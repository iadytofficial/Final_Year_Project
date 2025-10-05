const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const dayjs = require('dayjs');
const Users = require('../models/User');
const BroadcastRequests = require('../models/BroadcastRequest');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

const maintenanceQueue = new Queue('maintenance', { connection });

async function scheduleJobs() {
  // Hourly: clean expired verification and reset tokens
  await maintenanceQueue.add('clean-expired-tokens', {}, { repeat: { cron: '0 * * * *' } });
  // Every 5 minutes: expire broadcasts
  await maintenanceQueue.add('broadcast-expiry', {}, { repeat: { cron: '*/5 * * * *' } });
}

new Worker('maintenance', async (job) => {
  if (job.name === 'clean-expired-tokens') {
    const now = dayjs().toDate();
    await Users.updateMany({ VerificationTokenExpiresAt: { $lt: now } }, { $unset: { VerificationToken: 1, VerificationTokenExpiresAt: 1 } });
    await Users.updateMany({ PasswordResetExpiresAt: { $lt: now } }, { $unset: { PasswordResetToken: 1, PasswordResetExpiresAt: 1 } });
  }
  if (job.name === 'broadcast-expiry') {
    const now = dayjs().toDate();
    const expired = await BroadcastRequests.find({ Status: 'Pending', ExpiresAt: { $lt: now } }).select('_id');
    for (const item of expired) {
      await BroadcastRequests.updateOne({ _id: item._id }, { $set: { Status: 'Timeout' } });
    }
  }
}, { connection });

module.exports = { scheduleJobs };
