const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getAllRoles } = require('../controllers/roleController');

router.get('/', authenticateToken, authorizeRoles('admin', 'manager'), getAllRoles);

module.exports = router;