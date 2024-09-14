const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Add new student
router.post('/', protect, async (req, res) => {
  const { name, email, course } = req.body;

  const student = new Student({
    name,
    email,
    course,
  });

  const createdStudent = await student.save();
  res.status(201).json(createdStudent);
});

// Update student
router.put('/:id', protect, async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (student) {
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.course = req.body.course || student.course;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Delete student
router.delete('/:id', protect, async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (student) {
    await student.remove();
    res.json({ message: 'Student removed' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

module.exports = router;
