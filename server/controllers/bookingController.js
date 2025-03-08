const Booking = require('../models/Booking');
const ChefProfile = require('../models/ChefProfile');

// Create a new booking
exports.createBooking = async (req, res) => {
  const {
    chefId,
    date,
    duration,
    address,
    specialRequests
  } = req.body;

  try {
    // Get chef profile to check availability and calculate price
    const chefProfile = await ChefProfile.findById(chefId);
    
    if (!chefProfile) {
      return res.status(404).json({ msg: 'Chef not found' });
    }
    
    // Check if chef is available on that date
    const bookingDate = new Date(date);
    const isAvailable = chefProfile.availability.some(availableDate => {
      return availableDate.toDateString() === bookingDate.toDateString();
    });
    
    if (!isAvailable) {
      return res.status(400).json({ msg: 'Chef is not available on this date' });
    }
    
    // Calculate total price
    const totalPrice = chefProfile.hourlyRate * duration;
    
    // Create new booking
    const newBooking = new Booking({
      client: req.user.id,
      chef: chefId,
      date: bookingDate,
      duration,
      address,
      specialRequests,
      totalPrice
    });
    
    await newBooking.save();
    
    // Remove the date from chef's availability
    await ChefProfile.findByIdAndUpdate(
      chefId,
      { $pull: { availability: { $gte: new Date(bookingDate.setHours(0, 0, 0, 0)), $lt: new Date(bookingDate.setHours(23, 59, 59, 999)) } } },
      { new: true }
    );
    
    res.json(newBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all bookings for a client
exports.getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .populate({
        path: 'chef',
        select: 'speciality hourlyRate',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .sort({ date: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all bookings for a chef
exports.getChefBookings = async (req, res) => {
  try {
    // First find the chef profile for this user
    const chefProfile = await ChefProfile.findOne({ user: req.user.id });
    
    if (!chefProfile) {
      return res.status(404).json({ msg: 'Chef profile not found' });
    }
    
    const bookings = await Booking.find({ chef: chefProfile._id })
      .populate({
        path: 'client',
        select: 'name email'
      })
      .sort({ date: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    // Find booking
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Verify chef owns this booking
    const chefProfile = await ChefProfile.findOne({ user: req.user.id });
    
    if (!chefProfile || booking.chef.toString() !== chefProfile._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // If rejecting the booking, add the date back to availability
    if (status === 'rejected' && booking.status === 'pending') {
      await ChefProfile.findByIdAndUpdate(
        booking.chef,
        { $push: { availability: booking.date } },
        { new: true }
      );
    }
    
    // Update status
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update booking to completed when time is up (this would be called by a scheduled job)
exports.checkCompletedBookings = async () => {
  try {
    const now = new Date();
    
    // Find bookings that should be completed
    const bookings = await Booking.find({
      status: 'accepted',
      date: { $lt: now }
    });
    
    for (const booking of bookings) {
      // Calculate end time of booking
      const endTime = new Date(booking.date);
      endTime.setHours(endTime.getHours() + booking.duration);
      
      // If booking should be completed
      if (endTime < now) {
        booking.status = 'completed';
        await booking.save();
      }
    }
    
    return { success: true, count: bookings.length };
  } catch (err) {
    console.error('Error checking completed bookings:', err.message);
    return { success: false, error: err.message };
  }
};