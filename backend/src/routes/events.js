const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

router.get('/', authenticateToken, getAllEvents);
router.get('/:id', authenticateToken, getEventById);
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteEvent);

module.exports = router;