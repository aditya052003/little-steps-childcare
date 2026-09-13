const express = require('express');
const router = express.Router();
const db = require('../db');

// List reviews (optionally for a center)
router.get('/', (req, res) => {
  const centerId = req.query.centerId;
  const reviews = db.getReviews(centerId);
  res.json({ success: true, count: reviews.length, data: reviews });
});

// Submit review
router.post('/', (req, res) => {
  try {
    const { centerId, parentName, rating, comment, childAgeGroup } = req.body;
    if (!centerId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'centerId, rating, and comment are required' });
    }

    const review = db.createReview({
      centerId,
      parentName: parentName || 'Verified Parent',
      rating: Number(rating),
      comment,
      childAgeGroup: childAgeGroup || 'Toddler'
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
