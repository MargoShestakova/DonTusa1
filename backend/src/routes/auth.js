const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { register, login, me, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, me);
router.post('/logout', authenticateToken, logout);

module.exports = router;