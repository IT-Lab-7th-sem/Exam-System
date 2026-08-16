const express = require('express');
const { submitExam, getMySubmissions, getExamSubmissions } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), submitExam);
router.get('/my', protect, authorize('student'), getMySubmissions);
router.get('/exam/:examId', protect, authorize('examiner', 'admin'), getExamSubmissions);

module.exports = router;