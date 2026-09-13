const express = require('express');
const router = express.Router();
const db = require('../db');

// List centers with rich filtering (search, is24x7, ageGroup, timingType, maxPrice, verificationStatus)
router.get('/', (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      is24x7: req.query.is24x7,
      ageGroup: req.query.ageGroup,
      timingType: req.query.timingType,
      maxPrice: req.query.maxPrice,
      verificationStatus: req.query.status
    };
    const centers = db.getCenters(filters);
    res.json({ success: true, count: centers.length, data: centers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single center details
router.get('/:id', (req, res) => {
  const center = db.getCenterById(req.params.id);
  if (!center) {
    return res.status(404).json({ success: false, message: 'Center not found' });
  }
  // Include associated caregivers
  const caregivers = db.getCaregivers(center.id);
  const reviews = db.getReviews(center.id);
  res.json({
    success: true,
    data: {
      ...center,
      caregivers,
      reviews
    }
  });
});

// Create new center (Provider self-onboarding)
router.post('/', (req, res) => {
  try {
    const center = db.createCenter(req.body);
    res.status(201).json({ success: true, message: 'Center created successfully', data: center });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update center details, pricing or capacity
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateCenter(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }
    res.json({ success: true, message: 'Center updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
