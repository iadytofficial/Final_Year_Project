const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const dayjs = require('dayjs');
const Users = require('../models/User');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

const maintenanceQueue = new Queue('maintenance', { connection });

async function scheduleJobs() {
  // Hourly: clean expired verification and reset tokens
  await maintenanceQueue.add('clean-expired-tokens', {}, { repeat: { cron: '0 * * * *' } });
}

new Worker('maintenance', async (job) => {
  if (job.name === 'clean-expired-tokens') {
    const now = dayjs().toDate();
    await Users.updateMany({ VerificationTokenExpiresAt: { $lt: now } }, { $unset: { VerificationToken: 1, VerificationTokenExpiresAt: 1 } });
    await Users.updateMany({ PasswordResetExpiresAt: { $lt: now } }, { $unset: { PasswordResetToken: 1, PasswordResetExpiresAt: 1 } });
  }
}, { connection });

module.exports = { scheduleJobs };
