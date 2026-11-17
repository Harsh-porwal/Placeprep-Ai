const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeResume, getResumeHistory } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedExtensions = new Set(['.pdf', '.docx', '.txt']);
    const extname = allowedExtensions.has(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    const error = new Error('Only PDF, DOCX and TXT files are allowed');
    error.statusCode = 400;
    cb(error);
  },
});

router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getResumeHistory);

module.exports = router;
