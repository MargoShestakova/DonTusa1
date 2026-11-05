const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', getServices);
router.post('/', authenticateToken, createService);
router.put('/:id', authenticateToken, updateService);
router.delete('/:id', authenticateToken, deleteService);

module.exports = router;