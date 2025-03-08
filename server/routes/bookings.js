const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private (client only)
router.post('/', auth, roleAuth(['client']), bookingController.createBooking);

// @route   GET api/bookings/client
// @desc    Get all bookings for a client
// @access  Private (client only)
router.get('/client', auth, roleAuth(['client']), bookingController.getClientBookings);

// @route   GET api/bookings/chef
// @desc    Get all bookings for a chef
// @access  Private (chef only)
router.get('/chef', auth, roleAuth(['chef']), bookingController.getChefBookings);

// @route   PUT api/bookings/:id
// @desc    Update booking status
// @access  Private (chef only)
router.put('/:id', auth, roleAuth(['chef']), bookingController.updateBookingStatus);

module.exports = router;