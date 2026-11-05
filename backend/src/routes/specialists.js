const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  getAllSpecialists,
  getSpecialistProfile,
  updateSpecialistProfile,
  getMyProfile,
} = require('../controllers/specialistController');

router.get('/', getAllSpecialists);
router.get('/:id', getSpecialistProfile);
router.put('/profile', authenticateToken, updateSpecialistProfile);
router.get('/profile/me', authenticateToken, getMyProfile);

module.exports = router;