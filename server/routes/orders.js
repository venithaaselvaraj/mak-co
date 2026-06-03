import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Get all orders (Admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get latest order for a user
router.get('/latest/:userId', async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest order' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = { status };
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    
    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router;
