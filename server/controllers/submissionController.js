const Exam = require('../models/Exam');
const Submission = require('../models/Submission');

// @desc   Submit exam answers & auto-grade
// @route  POST /api/submissions
const submitExam = async (req, res) => {
  const { examId, answers } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      exam: examId,
      student: req.user._id
    });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this exam' });
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;

    exam.questions.forEach((q, index) => {
      maxScore += q.marks || 1;
      const submittedAnswer = answers.find((a) => a.questionIndex === index);
      if (submittedAnswer && submittedAnswer.selectedOptionIndex === q.correctOptionIndex) {
        totalScore += q.marks || 1;
      }
    });

    const submission = await Submission.create({
      exam: examId,
      student: req.user._id,
      answers,
      totalScore,
      maxScore
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in student's submissions
// @route  GET /api/submissions/my
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('exam', 'title durationMinutes')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all submissions for an exam (Examiner / Admin)
// @route  GET /api/submissions/exam/:examId
const getExamSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ exam: req.params.examId })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitExam, getMySubmissions, getExamSubmissions };