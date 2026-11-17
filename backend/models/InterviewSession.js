const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewType: {
      type: String,
      required: true, // HR, Technical, DSA, DBMS, OS, CN, Java, Python, JavaScript
    },
    difficulty: {
      type: String,
      default: 'Intermediate', // Beginner, Intermediate, Advanced
    },
    questions: [
      {
        question: String,
        userAnswer: String,
        score: Number, // out of 10
        feedback: String,
        missingPoints: String,
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    communicationScore: {
      type: Number,
      default: 0,
    },
    suggestions: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
