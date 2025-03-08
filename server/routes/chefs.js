const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// @route   GET api/chefs
// @desc    Get all chef profiles
// @access  Public
router.get('/', chefController.getAllChefs);

// @route   GET api/chefs/:id
// @desc    Get chef profile by ID
// @access  Public
router.get('/:id', chefController.getChefById);

// @route   POST api/chefs
// @desc    Create or update chef profile
// @access  Private (chef or admin)
router.post('/', auth, roleAuth(['chef', 'admin']), chefController.createChefProfile);

// @route   DELETE api/chefs/:id
// @desc    Delete chef profile
// @access  Private (admin only)
router.delete('/:id', auth, roleAuth(['admin']), chefController.deleteChefProfile);

// @route   PUT api/chefs/availability
// @desc    Update chef availability
// @access  Private (chef only)
router.put('/availability', auth, roleAuth(['chef']), chefController.updateAvailability);

module.exports = router;