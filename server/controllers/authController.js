const crypto = require('crypto');
const dayjs = require('dayjs');
const Users = require('../models/User');
const Sessions = require('../models/Session');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/authValidators');

async function register(req, res, next) {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });

    const { fullName, email, password, phoneNumber, role } = value;
    const existing = await Users.findOne({ Email: email });
    if (existing) return res.status(400).json({ code: 'VAL002', message: 'Email already registered' });

    const hashed = await hashPassword(password);
    const verificationToken = crypto.randomUUID();
    const verificationExpires = dayjs().add(24, 'hour').toDate();

    const user = await Users.create({
      FullName: fullName,
      Email: email,
      Password: hashed,
      PhoneNumber: phoneNumber,
      Role: role,
      VerificationToken: verificationToken,
      VerificationTokenExpiresAt: verificationExpires,
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your AgroLK email',
      html: `<p>Hi ${fullName},</p><p>Please verify your email by clicking <a href="${verifyUrl}">this link</a>. Link expires in 24 hours.</p>`,
    });

    return res.status(201).json({ message: 'Registered. Please verify your email.' });
  } catch (err) { return next(err); }
}

async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const { email, password } = value;

    const user = await Users.findOne({ Email: email });
    if (!user) return res.status(401).json({ code: 'AUTH001', message: 'Invalid credentials' });

    const ok = await comparePassword(password, user.Password);
    if (!ok) {
      await Users.updateOne({ _id: user._id }, { $inc: { FailedLoginAttempts: 1 } });
      return res.status(401).json({ code: 'AUTH001', message: 'Invalid credentials' });
    }

    if (user.FailedLoginAttempts >= 5) {
      return res.status(423).json({ code: 'AUTH003', message: 'Account locked. Try later.' });
    }

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.Role });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.Role });

    const expiresAt = dayjs().add(parseInt(process.env.REMEMBER_ME_DURATION_DAYS || '30', 10), 'day').toDate();

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await Sessions.create({
      UserID: user._id,
      RefreshTokenHash: refreshTokenHash,
      DeviceFingerprint: req.headers['x-device-id'] || '',
      IPAddress: req.ip,
      UserAgent: req.headers['user-agent'] || '',
      ExpiresAt: expiresAt,
    });

    await Users.updateOne({ _id: user._id }, { $set: { FailedLoginAttempts: 0, LastLoginAt: new Date() } });

    return res.json({
      token: accessToken,
      refreshToken,
      user: {
        UserID: user._id,
        FullName: user.FullName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        Role: user.Role,
        ProfilePic: user.ProfilePic,
        EmailVerified: user.EmailVerified,
      },
    });
  } catch (err) { return next(err); }
}

async function me(req, res, next) {
  try {
    const user = await Users.findById(req.user.userId);
    if (!user) return res.status(404).json({ code: 'SYS001', message: 'User not found' });
    return res.json({
      UserID: user._id,
      FullName: user.FullName,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role,
      ProfilePic: user.ProfilePic,
      EmailVerified: user.EmailVerified,
      CreatedAt: user.CreatedAt,
    });
  } catch (err) { return next(err); }
}

async function verifyEmail(req, res, next) {
  try {
    const token = req.params.token;
    if (!token) return res.status(400).json({ code: 'VAL002', message: 'Token required' });
    const user = await Users.findOne({ VerificationToken: token });
    if (!user || !user.VerificationTokenExpiresAt || dayjs(user.VerificationTokenExpiresAt).isBefore(dayjs())) {
      return res.status(400).json({ code: 'AUTH002', message: 'Invalid or expired token' });
    }

    user.EmailVerified = true;
    user.VerificationToken = null;
    await user.save();

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.Role });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.Role });

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = dayjs().add(parseInt(process.env.REMEMBER_ME_DURATION_DAYS || '30', 10), 'day').toDate();
    await Sessions.create({ UserID: user._id, RefreshTokenHash: refreshTokenHash, ExpiresAt: expiresAt });

    return res.json({ message: 'Email verified', token: accessToken, refreshToken });
  } catch (err) { return next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    const { value, error } = forgotPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const { email } = value;
    const user = await Users.findOne({ Email: email });
    if (!user) return res.json({ message: 'If the email exists, a reset link was sent.' });
    const token = crypto.randomUUID();
    const expires = dayjs().add(1, 'hour').toDate();
    user.PasswordResetToken = token;
    user.PasswordResetExpiresAt = expires;
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail({ to: email, subject: 'Reset your AgroLK password', html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>. Link expires in 1 hour.</p>` });
    return res.json({ message: 'If the email exists, a reset link was sent.' });
  } catch (err) { return next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const token = req.params.token;
    const { value, error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ code: 'VAL001', message: error.message });
    const { newPassword } = value;
    const user = await Users.findOne({ PasswordResetToken: token });
    if (!user || !user.PasswordResetExpiresAt || dayjs(user.PasswordResetExpiresAt).isBefore(dayjs())) {
      return res.status(400).json({ code: 'AUTH002', message: 'Invalid or expired token' });
    }
    user.Password = await hashPassword(newPassword);
    user.PasswordResetToken = null;
    user.PasswordResetExpiresAt = null;
    await user.save();
    // Invalidate all sessions
    await Sessions.deleteMany({ UserID: user._id });
    await sendEmail({ to: user.Email, subject: 'Your AgroLK password was changed', html: '<p>Your password has been successfully changed.</p>' });
    return res.json({ message: 'Password reset successful' });
  } catch (err) { return next(err); }
}

async function logout(req, res, next) {
  try {
    const token = req.body.refreshToken;
    if (!token) return res.status(400).json({ code: 'VAL002', message: 'refreshToken required' });
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await Sessions.deleteOne({ RefreshTokenHash: hash });
    return res.json({ message: 'Logged out' });
  } catch (err) { return next(err); }
}

async function refreshToken(req, res, next) {
  try {
    const token = req.body.refreshToken;
    if (!token) return res.status(400).json({ code: 'VAL002', message: 'refreshToken required' });
    const decoded = verifyRefreshToken(token);
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await Sessions.findOne({ UserID: decoded.userId, RefreshTokenHash: hash });
    if (!session || dayjs(session.ExpiresAt).isBefore(dayjs())) {
      return res.status(401).json({ code: 'AUTH002', message: 'Refresh token expired or invalid' });
    }
    const accessToken = signAccessToken({ userId: decoded.userId, role: decoded.role });
    return res.json({ token: accessToken });
  } catch (err) { return next(err); }
}

async function listSessions(req, res, next) {
  try {
    const sessions = await Sessions.find({ UserID: req.user.userId }).select('-RefreshTokenHash');
    return res.json({ sessions });
  } catch (err) { return next(err); }
}

async function revokeSession(req, res, next) {
  try {
    const sessionId = req.params.sessionId;
    await Sessions.deleteOne({ _id: sessionId, UserID: req.user.userId });
    return res.json({ message: 'Session revoked' });
  } catch (err) { return next(err); }
}

module.exports = { register, login, me, verifyEmail, logout, refreshToken, listSessions, revokeSession, forgotPassword, resetPassword };
