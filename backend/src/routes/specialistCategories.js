const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getAllCategories, createCategory } = require('../controllers/specialistCategoryController');

router.get('/', getAllCategories);
router.post('/', authenticateToken, authorizeRoles('admin'), createCategory);

module.exports = router;