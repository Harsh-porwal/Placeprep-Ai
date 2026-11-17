const CodingQuestion = require('../models/CodingQuestion');
const Progress = require('../models/Progress');

// @desc    Get all coding questions with user solved status
// @route   GET /api/coding/questions
// @access  Public (or Private)
exports.getCodingQuestions = async (req, res) => {
  try {
    const { topic, difficulty, company, status } = req.query;

    const query = {};
    if (topic && topic !== 'All') query.topic = topic;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (company && company !== 'All') {
      query.company = { $regex: company, $options: 'i' };
    }

    const questions = await CodingQuestion.find(query).sort({ createdAt: -1 });

    let solvedQuestionIds = [];
    if (req.user) {
      const userProgress = await Progress.find({
        userId: req.user._id,
        solved: true,
      });
      solvedQuestionIds = userProgress.map((p) => p.questionId.toString());
    }

    const formattedQuestions = questions.map((q) => {
      const isSolved = solvedQuestionIds.includes(q._id.toString());
      return {
        ...q._doc,
        isSolved,
      };
    });

    // Filter by solved/unsolved if requested
    let result = formattedQuestions;
    if (status === 'Solved') {
      result = formattedQuestions.filter((q) => q.isSolved);
    } else if (status === 'Unsolved') {
      result = formattedQuestions.filter((q) => !q.isSolved);
    }

    return res.json({
      success: true,
      count: result.length,
      questions: result,
    });
  } catch (error) {
    console.error('Error fetching coding questions:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle solved status for a coding question
// @route   POST /api/coding/progress
// @access  Private
exports.toggleQuestionSolved = async (req, res) => {
  try {
    const { questionId, solved } = req.body;
    const userId = req.user._id;

    if (!questionId) {
      return res
        .status(400)
        .json({ success: false, message: 'Question ID is required' });
    }

    let progress = await Progress.findOne({ userId, questionId });

    if (progress) {
      progress.solved = solved !== undefined ? solved : !progress.solved;
      progress.solvedAt = Date.now();
      await progress.save();
    } else {
      progress = await Progress.create({
        userId,
        questionId,
        solved: solved !== undefined ? solved : true,
      });
    }

    // Get total solved count for user
    const solvedCount = await Progress.countDocuments({
      userId,
      solved: true,
    });
    const totalCount = await CodingQuestion.countDocuments();

    return res.json({
      success: true,
      solved: progress.solved,
      solvedCount,
      totalCount,
    });
  } catch (error) {
    console.error('Error updating coding progress:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get coding progress breakdown
// @route   GET /api/coding/progress
// @access  Private
exports.getCodingProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProgress = await Progress.find({ userId, solved: true });
    const solvedIds = userProgress.map((p) => p.questionId.toString());

    const totalQuestions = await CodingQuestion.countDocuments();
    const solvedCount = solvedIds.length;

    // Difficulty breakdown
    const easyTotal = await CodingQuestion.countDocuments({ difficulty: 'Easy' });
    const mediumTotal = await CodingQuestion.countDocuments({ difficulty: 'Medium' });
    const hardTotal = await CodingQuestion.countDocuments({ difficulty: 'Hard' });

    const solvedQuestions = await CodingQuestion.find({ _id: { $in: solvedIds } });
    const easySolved = solvedQuestions.filter((q) => q.difficulty === 'Easy').length;
    const mediumSolved = solvedQuestions.filter((q) => q.difficulty === 'Medium').length;
    const hardSolved = solvedQuestions.filter((q) => q.difficulty === 'Hard').length;

    return res.json({
      success: true,
      totalQuestions,
      solvedCount,
      percentage: totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0,
      breakdown: {
        easy: { solved: easySolved, total: easyTotal },
        medium: { solved: mediumSolved, total: mediumTotal },
        hard: { solved: hardSolved, total: hardTotal },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
