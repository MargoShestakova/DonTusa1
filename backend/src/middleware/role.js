function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Пользователь не аутентифицирован' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      console.log('[DEBUG role] req.user.role =', req.user.role, 'allowedRoles =', allowedRoles);
      return res.status(403).json({ success: false, message: 'Недостаточно прав доступа' });
    }
    next();
  };
}

module.exports = { authorizeRoles };