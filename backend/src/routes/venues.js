const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue } = require('../controllers/venueController');

router.get('/', getAllVenues);
router.get('/:id', getVenueById);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createVenue);
router.put('/:id', authenticateToken, updateVenue);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteVenue);

module.exports = router;