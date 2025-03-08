const ChefProfile = require('../models/ChefProfile');
const User = require('../models/User');

// Get all chef profiles
exports.getAllChefs = async (req, res) => {
  try {
    const chefProfiles = await ChefProfile.find().populate('user', ['name', 'email']);
    res.json(chefProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get chef profile by ID
exports.getChefById = async (req, res) => {
  try {
    const chefProfile = await ChefProfile.findById(req.params.id).populate('user', ['name', 'email']);
    
    if (!chefProfile) {
      return res.status(404).json({ msg: 'Chef profile not found' });
    }
    
    res.json(chefProfile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Chef profile not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Create or update chef profile
exports.createChefProfile = async (req, res) => {
  const {
    speciality,
    bio,
    experience,
    cuisine,
    hourlyRate,
    profileImage,
    availability
  } = req.body;

  // Build chef profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (speciality) profileFields.speciality = speciality;
  if (bio) profileFields.bio = bio;
  if (experience) profileFields.experience = experience;
  if (cuisine) {
    profileFields.cuisine = cuisine.split(',').map(skill => skill.trim());
  }
  if (hourlyRate) profileFields.hourlyRate = hourlyRate;
  if (profileImage) profileFields.profileImage = profileImage;
  if (availability) {
    profileFields.availability = availability.map(date => new Date(date));
  }

  try {
    let chefProfile = await ChefProfile.findOne({ user: req.user.id });

    if (chefProfile) {
      // Update
      chefProfile = await ChefProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(chefProfile);
    }

    // Create
    chefProfile = new ChefProfile(profileFields);
    await chefProfile.save();
    
    // Update user role if not already a chef
    await User.findByIdAndUpdate(
      req.user.id,
      { role: 'chef' },
      { new: true }
    );

    res.json(chefProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete chef profile
exports.deleteChefProfile = async (req, res) => {
  try {
    await ChefProfile.findOneAndRemove({ user: req.params.id });
    await User.findByIdAndUpdate(
      req.params.id,
      { role: 'client' },
      { new: true }
    );
    
    res.json({ msg: 'Chef profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update chef availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    
    if (!availability || !Array.isArray(availability)) {
      return res.status(400).json({ msg: 'Please provide valid availability dates' });
    }
    
    const availabilityDates = availability.map(date => new Date(date));
    
    const chefProfile = await ChefProfile.findOneAndUpdate(
      { user: req.user.id },
      { availability: availabilityDates },
      { new: true }
    );
    
    if (!chefProfile) {
      return res.status(404).json({ msg: 'Chef profile not found' });
    }
    
    res.json(chefProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};