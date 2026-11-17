const AptitudeQuestion = require('../models/AptitudeQuestion');

// @desc    Get aptitude questions filtered by category/difficulty
// @route   GET /api/aptitude/questions
// @access  Public
exports.getAptitudeQuestions = async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const questions = await AptitudeQuestion.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
