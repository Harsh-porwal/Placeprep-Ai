const User = require('../models/User');
const Company = require('../models/Company');
const CodingQuestion = require('../models/CodingQuestion');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const InterviewSession = require('../models/InterviewSession');

// @desc    Get overall admin portal statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await Company.countDocuments();
    const totalCodingQuestions = await CodingQuestion.countDocuments();
    const totalAptitudeQuestions = await AptitudeQuestion.countDocuments();
    const totalInterviews = await InterviewSession.countDocuments();

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalCompanies,
        totalQuestions: totalCodingQuestions + totalAptitudeQuestions,
        totalCodingQuestions,
        totalAptitudeQuestions,
        totalInterviews,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    return res.json({ success: true, count: students.length, students });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add a company
// @route   POST /api/admin/companies
// @access  Private (Admin)
exports.addCompany = async (req, res) => {
  try {
    const { name, description, logo, category, packageRange, skills } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    const newCompany = await Company.create({
      name,
      description,
      logo: logo || '',
      category: category || 'Product',
      packageRange: packageRange || '6 - 15 LPA',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      codingQuestions: [],
      technicalQuestions: [],
      hrQuestions: [],
      aptitudeTopics: ['Quantitative', 'Logical']
    });

    return res.status(201).json({ success: true, company: newCompany });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/admin/companies/:id
// @access  Private (Admin)
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    return res.json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/admin/companies/:id
// @access  Private (Admin)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    return res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add coding question
// @route   POST /api/admin/questions
// @access  Private (Admin)
exports.addCodingQuestion = async (req, res) => {
  try {
    const { title, description, difficulty, topic, company, externalLink } = req.body;
    if (!title || !difficulty || !topic) {
      return res.status(400).json({ success: false, message: 'Title, difficulty, and topic are required' });
    }

    const newQuestion = await CodingQuestion.create({
      title,
      description: description || '',
      difficulty,
      topic,
      company: company || 'All',
      externalLink: externalLink || 'https://leetcode.com',
    });

    return res.status(201).json({ success: true, question: newQuestion });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete coding question
// @route   DELETE /api/admin/questions/:id
// @access  Private (Admin)
exports.deleteCodingQuestion = async (req, res) => {
  try {
    const question = await CodingQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    return res.json({ success: true, message: 'Coding question deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add aptitude question
// @route   POST /api/admin/aptitude
// @access  Private (Admin)
exports.addAptitudeQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation, category, difficulty } = req.body;
    if (!question || !options || correctAnswer === undefined || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields for aptitude question' });
    }

    const newAptitude = await AptitudeQuestion.create({
      question,
      options: Array.isArray(options) ? options : options.split(',').map(s => s.trim()),
      correctAnswer: parseInt(correctAnswer),
      explanation: explanation || '',
      category,
      difficulty: difficulty || 'Medium',
    });

    return res.status(201).json({ success: true, aptitude: newAptitude });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete aptitude question
// @route   DELETE /api/admin/aptitude/:id
// @access  Private (Admin)
exports.deleteAptitudeQuestion = async (req, res) => {
  try {
    const question = await AptitudeQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Aptitude question not found' });
    }
    return res.json({ success: true, message: 'Aptitude question deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
