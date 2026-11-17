const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeFileName: {
      type: String,
      default: 'Uploaded_Resume.pdf',
    },
    targetJobTitle: {
      type: String,
      default: 'Software Engineer / Full Stack Developer',
    },
    score: {
      type: Number,
      required: true, // 0 to 100
    },
    skillsDetected: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    formattingSuggestions: {
      type: [String],
      default: [],
    },
    contentSuggestions: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    recommendedImprovements: {
      type: [String],
      default: [],
    },
    jobMatchScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
