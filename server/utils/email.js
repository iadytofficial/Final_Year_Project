const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return nodemailer.createTransport({ host, port, auth: user ? { user, pass } : undefined });
}

async function sendEmail({ to, subject, html }) {
  const fromName = process.env.EMAIL_FROM_NAME || 'AgroLK';
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;
  const transporter = createTransport();
  await transporter.sendMail({ from: `${fromName} <no-reply@agrolk.com>`, to, subject, html, replyTo });
}

module.exports = { sendEmail };
