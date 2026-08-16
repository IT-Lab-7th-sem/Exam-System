const Exam = require('../models/Exam');

// @desc   Create a new exam (Examiner only)
// @route  POST /api/exams
const createExam = async (req, res) => {
  const { title, description, durationMinutes, questions } = req.body;

  if (!questions || questions.length === 0) {
    return res.status(400).json({ message: 'An exam must have at least one question' });
  }

  try {
    const exam = await Exam.create({
      title,
      description,
      durationMinutes,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all exams (General listing)
// @route  GET /api/exams
const getExams = async (req, res) => {
  try {
    // If student, strip out questions count or details if needed
    const exams = await Exam.find({})
      .populate('createdBy', 'name email')
      .select('-questions.correctOptionIndex')
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get exam details for taking an exam
// @route  GET /api/exams/:id
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Hide correct answers if the user is a student
    if (req.user.role === 'student') {
      const sanitizedQuestions = exam.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks
      }));

      return res.json({
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        questions: sanitizedQuestions
      });
    }

    // Examiners/Admins get full exam with answers
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete an exam
// @route  DELETE /api/exams/:id
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Only creator examiner or admin can delete
    if (req.user.role !== 'admin' && exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this exam' });
    }

    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createExam, getExams, getExamById, deleteExam };