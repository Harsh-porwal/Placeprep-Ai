const mongoose = require('mongoose');

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    topic: {
      type: String,
      required: true,
      enum: [
        'Arrays',
        'Strings',
        'Linked Lists',
        'Stack',
        'Queue',
        'Trees',
        'Graphs',
        'Recursion',
        'Dynamic Programming',
        'Searching',
        'Sorting',
      ],
    },
    company: {
      type: String, // e.g. "Google", "Amazon", "Infosys", "All"
      default: 'All',
    },
    externalLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);
