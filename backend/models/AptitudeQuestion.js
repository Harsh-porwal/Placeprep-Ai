const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true, // Array of 4 options
    },
    correctAnswer: {
      type: Number, // 0, 1, 2, or 3 (index in options array)
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Data Interpretation',
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);