const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', requireAuth, ctrl.me);
router.post('/verify-email/:token', ctrl.verifyEmail);
router.post('/logout', ctrl.logout);
router.post('/refresh-token', ctrl.refreshToken);
router.get('/sessions', requireAuth, ctrl.listSessions);
router.delete('/sessions/:sessionId', requireAuth, ctrl.revokeSession);

module.exports = router;
