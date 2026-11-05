const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getActivityLog, createActivityLog } = require('../controllers/activityLogController');

router.get('/', authenticateToken, authorizeRoles('admin', 'manager'), getActivityLog);
router.post('/', authenticateToken, createActivityLog);

module.exports = router;