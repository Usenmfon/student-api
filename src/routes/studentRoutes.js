const express = require('express');
const {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} = require('../controllers/studentController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'teacher', 'student'), getStudents)
  .post(authorize('admin'), createStudent);

router
  .route('/:id')
  .get(authorize('admin', 'teacher', 'student'), getStudentById)
  .put(authorize('admin', 'teacher'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
