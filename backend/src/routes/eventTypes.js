const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  getAllEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
} = require('../controllers/eventTypeController');

router.get('/', getAllEventTypes);
router.post('/', authenticateToken, authorizeRoles('admin'), createEventType);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateEventType);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteEventType);

module.exports = router;