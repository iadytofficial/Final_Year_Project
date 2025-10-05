const Payments = require('../models/Payment');
const Refunds = require('../models/Refund');
const Bookings = require('../models/Booking');
const { createPaymentIntent, confirmPaymentIntent, refundPayment } = require('../services/payments');

async function createIntent(req, res, next) {
  try {
    const { bookingId } = req.body;
    const booking = await Bookings.findById(bookingId);
    if (!booking) return res.status(404).json({ code: 'SYS001', message: 'Booking not found' });
    const intent = await createPaymentIntent(booking.TotalCost, undefined, { bookingId: booking._id.toString() });
    const payment = await Payments.create({ BookingID: booking._id, Amount: booking.TotalCost, Status: 'Pending', TransactionID: intent.id, PaymentMethod: 'stripe' });
    return res.json({ clientSecret: intent.client_secret, paymentId: payment._id });
  } catch (err) { return next(err); }
}

async function confirm(req, res, next) {
  try {
    const { paymentIntentId } = req.body;
    const intent = await confirmPaymentIntent(paymentIntentId);
    const payment = await Payments.findOne({ TransactionID: paymentIntentId });
    if (!payment) return res.status(404).json({ code: 'SYS001', message: 'Payment not found' });
    if (intent.status === 'succeeded') {
      payment.Status = 'Success';
      payment.PaymentDate = new Date();
      await payment.save();
    }
    return res.json({ status: payment.Status });
  } catch (err) { return next(err); }
}

async function webhook(req, res, next) {
  try {
    // Implement Stripe webhook signature verification in production
    const event = req.body;
    // Acknowledge receipt
    return res.json({ received: true });
  } catch (err) { return next(err); }
}

async function history(req, res, next) {
  try {
    const list = await Payments.find({}).sort({ PaymentDate: -1 }).limit(100);
    return res.json({ items: list });
  } catch (err) { return next(err); }
}

async function refund(req, res, next) {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payments.findById(paymentId);
    if (!payment) return res.status(404).json({ code: 'SYS001', message: 'Payment not found' });
    const amount = Number(req.body.amount || payment.Amount);
    const result = await refundPayment(payment.TransactionID, amount);
    payment.Status = 'Refunded';
    payment.RefundAmount = amount;
    payment.RefundDate = new Date();
    payment.RefundReason = req.body.reason || '';
    await payment.save();
    await Refunds.create({ PaymentID: payment._id, BookingID: payment.BookingID, Amount: amount, Reason: payment.RefundReason, Status: 'Success', RefundMethod: 'stripe' });
    return res.json({ status: 'Refunded', refundId: result.id });
  } catch (err) { return next(err); }
}

module.exports = { createIntent, confirm, webhook, history, refund };
