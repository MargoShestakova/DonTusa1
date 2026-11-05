const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getSpecialistRequests, createSpecialistRequest, respondToRequest } = require('../controllers/specialistRequestController');

router.get('/', authenticateToken, getSpecialistRequests);
router.post('/', authenticateToken, createSpecialistRequest);
router.put('/:id/respond', authenticateToken, respondToRequest);

module.exports = router;