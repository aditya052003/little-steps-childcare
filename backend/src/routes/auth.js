const express = require('express');
const router = express.Router();
const db = require('../db');

// List available demo users for the role switcher
router.get('/users', (req, res) => {
  const users = db.getUsers();
  res.json({ success: true, data: users });
});

// Current user details
router.get('/user/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// Login by email
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or user not registered' });
  }
  res.json({ success: true, message: 'Login successful', data: user });
});

// Register new user (parent or provider)
router.post('/register', (req, res) => {
  const { name, email, role, phone, address, children, centerName } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  let newCenterId = null;
  if (role === 'provider' && centerName) {
    const newCenter = db.createCenter({
      name: centerName,
      address: address || '100 Main St',
      city: 'Metro City',
      is24x7: true,
      pricing: { hourly: 18, daily: 90, monthly: 1400 },
      capacity: {
        infant: { total: 10, occupied: 0 },
        toddler: { total: 15, occupied: 0 },
        preschool: { total: 20, occupied: 0 }
      },
      verificationStatus: 'pending_verification'
    });
    newCenterId = newCenter.id;
  }

  const newUser = db.createUser({
    name,
    email,
    role,
    phone: phone || '+1 (555) 000-0000',
    address: address || 'Metro City',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    children: children || [],
    centerId: newCenterId
  });

  res.status(201).json({ success: true, message: 'Registration successful', data: newUser });
});

module.exports = router;
