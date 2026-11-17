const express = require('express');
const router = express.Router();
const {
  getCodingQuestions,
  toggleQuestionSolved,
  getCodingProgress,
} = require('../controllers/codingController');
const { protect } = require('../middleware/auth');

// Optional auth helper to parse token if present
const optionalAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return protect(req, res, next);
  }
  next();
};

router.get('/questions', optionalAuth, getCodingQuestions);
router.post('/progress', protect, toggleQuestionSolved);
router.get('/progress', protect, getCodingProgress);

module.exports = router;
