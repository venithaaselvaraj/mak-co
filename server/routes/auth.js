import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sacred_temple_secret_key_mkv';

// SIGNUP ENDPOINT
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ code: 'auth/email-already-in-use', message: 'User already exists' });
    
    const user = new User({ name, email, password, phone, role: role || 'customer' });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { uid: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ code: 'auth/server-error', message: 'Server error during signup' });
  }
});

// LOGIN ENDPOINT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ code: 'auth/user-not-found', message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ code: 'auth/wrong-password', message: 'Invalid credentials' });
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ 
      token, 
      user: { uid: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ code: 'auth/server-error', message: 'Server error during login' });
  }
});

// RESTORE SESSION ENDPOINT
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ 
      user: { uid: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired session token' });
  }
});

export default router;
