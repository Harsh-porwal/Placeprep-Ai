const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingQuestion',
      required: true,
    },
    solved: {
      type: Boolean,
      default: true,
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index so a user has unique progress entries per question
progressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
