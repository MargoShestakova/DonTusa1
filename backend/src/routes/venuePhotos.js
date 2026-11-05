const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getVenuePhotos, addVenuePhoto } = require('../controllers/venuePhotoController');

router.get('/', getVenuePhotos);
router.post('/', authenticateToken, addVenuePhoto);

module.exports = router;