const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  exam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedOptionIndex: { type: Number, required: true }
  }],
  totalScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);