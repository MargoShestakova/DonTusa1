const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { getPortfolioPhotos, addPortfolioPhoto, deletePortfolioPhoto } = require('../controllers/portfolioController');

router.get('/', getPortfolioPhotos);
router.post('/', authenticateToken, upload.single('photo'), addPortfolioPhoto);
router.delete('/:id', authenticateToken, deletePortfolioPhoto);

module.exports = router;