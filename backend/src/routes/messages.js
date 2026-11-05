const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getMessages, createMessage, markAsRead } = require('../controllers/messageController');

router.get('/', authenticateToken, getMessages);
router.post('/', authenticateToken, createMessage);
router.put('/:id/read', authenticateToken, markAsRead);

module.exports = router;