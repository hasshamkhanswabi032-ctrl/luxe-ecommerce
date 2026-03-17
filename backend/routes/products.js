const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// Use memory storage instead of disk - works on Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all products (protected)
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add product (admin only)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, stock, imageUrl } = req.body;
    // Use imageUrl from body since we can't store files on Vercel
    const image = imageUrl || '';
    const product = await Product.create({ 
      title, description, price, image, category, stock, 
      createdBy: req.user._id 
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
