const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, authController.getUser);

module.exports = router;