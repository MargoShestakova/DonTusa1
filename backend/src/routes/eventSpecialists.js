const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getEventSpecialists, assignSpecialist, updateSelectionStatus } = require('../controllers/eventSpecialistController');

router.get('/', authenticateToken, getEventSpecialists);
router.post('/', authenticateToken, assignSpecialist);
router.put('/:id/status', authenticateToken, updateSelectionStatus);

module.exports = router;