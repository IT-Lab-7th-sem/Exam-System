const express = require('express');
const { createExam, getExams, getExamById, deleteExam } = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getExams)
  .post(protect, authorize('examiner', 'admin'), createExam);

router.route('/:id')
  .get(protect, getExamById)
  .delete(protect, authorize('examiner', 'admin'), deleteExam);

module.exports = router;