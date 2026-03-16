const router = require('express').Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    const order = await Order.create({ user: req.user._id, items, totalAmount, address });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all orders
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
