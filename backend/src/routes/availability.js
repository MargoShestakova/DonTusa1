const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAvailability, createAvailability, updateAvailability, deleteAvailability } = require('../controllers/availabilityController');

router.get('/', authenticateToken, getAvailability);
router.post('/', authenticateToken, createAvailability);
router.put('/:id', authenticateToken, updateAvailability);
router.delete('/:id', authenticateToken, deleteAvailability);

module.exports = router;