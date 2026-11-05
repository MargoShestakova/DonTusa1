const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getStatusHistory, createStatusHistory } = require('../controllers/statusHistoryController');

router.get('/', authenticateToken, getStatusHistory);
router.post('/', authenticateToken, createStatusHistory);

module.exports = router;