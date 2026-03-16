const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    // Validate required fields
    if (!email) return res.status(400).json({ message: 'Email is required' });

    let user = await User.findOne({ email });

    if (!user) {
      // New user — create account
      user = await User.create({
        googleId,
        email,
        name: name || email.split('@')[0],
        avatar: avatar || '',
        password: undefined
      });
    } else {
      // Existing user — link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', require('../middleware/auth').protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
