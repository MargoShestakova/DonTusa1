const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;