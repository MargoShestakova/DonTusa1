const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dontusa_access_secret_change_in_production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Токен доступа не предоставлен' });
  }

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Неверный или истёкший токен' });
    }
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'dontusa_refresh_secret_change_in_production',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
};