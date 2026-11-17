const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Product', // Product, Service, Consulting
    },
    packageRange: {
      type: String,
      default: '6 - 15 LPA',
    },
    skills: {
      type: [String],
      default: [],
    },
    codingQuestions: [
      {
        title: String,
        difficulty: String,
        topic: String,
        link: String,
      },
    ],
    technicalQuestions: [
      {
        question: String,
        category: String,
        answerHint: String,
      },
    ],
    hrQuestions: [
      {
        question: String,
        tip: String,
      },
    ],
    aptitudeTopics: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
