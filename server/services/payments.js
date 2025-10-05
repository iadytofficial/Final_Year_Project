const Stripe = require('stripe');
const Payments = require('../models/Payment');

const stripe = process.env.PAYMENT_GATEWAY_KEY ? new Stripe(process.env.PAYMENT_GATEWAY_KEY) : null;

async function createPaymentIntent(amount, currency = process.env.DEFAULT_CURRENCY || 'LKR', metadata = {}) {
  if (!stripe) throw new Error('Stripe not configured');
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: { enabled: true },
  });
  return intent;
}

async function confirmPaymentIntent(paymentIntentId) {
  if (!stripe) throw new Error('Stripe not configured');
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return intent;
}

async function refundPayment(paymentIntentId, amount) {
  if (!stripe) throw new Error('Stripe not configured');
  const refund = await stripe.refunds.create({ payment_intent: paymentIntentId, amount: Math.round(amount * 100) });
  return refund;
}

module.exports = { createPaymentIntent, confirmPaymentIntent, refundPayment };
