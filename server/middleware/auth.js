const { verifyAccessToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ code: 'AUTH003', message: 'Unauthorized access' });
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ code: 'AUTH002', message: 'Token expired or invalid' });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ code: 'AUTH003', message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
