const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Block User
router.put('/:id/block', protect, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.status = 'blocked';
    await user.save();
    res.json({ message: 'User blocked' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Unblock User
router.put('/:id/unblock', protect, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.status = 'active';
    await user.save();
    res.json({ message: 'User unblocked' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
