const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getVenueEventTypes, createVenueEventType } = require('../controllers/venueEventTypeController');

router.get('/', getVenueEventTypes);
router.post('/', authenticateToken, createVenueEventType);

module.exports = router;