const mongoose = require('mongoose');
const Student = require('../models/Student');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getStudents = async (req, res, next) => {
  try {
    const { course, status, search, sort } = req.query;
    const filter = {};

    if (course) {
      filter.course = new RegExp(escapeRegex(course), 'i');
    }

    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        res.status(400);
        throw new Error('Status must be active or inactive');
      }

      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { course: searchRegex },
      ];
    }

    const students = await Student.find(filter).sort(sort || '-createdAt');

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error('Invalid MongoDB ObjectId');
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    res.status(200).json({
      success: true,
      message: 'Student fetched successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error('Invalid MongoDB ObjectId');
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error('Invalid MongoDB ObjectId');
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
