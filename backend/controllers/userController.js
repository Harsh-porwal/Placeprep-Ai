const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      college,
      degree,
      branch,
      graduationYear,
      skills,
      careerGoal,
      github,
      linkedin,
      avatar,
    } = req.body;

    if (name) user.name = name;
    if (college) user.college = college;
    if (degree) user.degree = degree;
    if (branch) user.branch = branch;
    if (graduationYear) user.graduationYear = graduationYear;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (careerGoal) user.careerGoal = careerGoal;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    return res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        degree: updatedUser.degree,
        branch: updatedUser.branch,
        graduationYear: updatedUser.graduationYear,
        skills: updatedUser.skills,
        careerGoal: updatedUser.careerGoal,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
};
