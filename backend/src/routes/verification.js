const express = require('express');
const router = express.Router();
const db = require('../db');

// List verification requests (all or filter by status: pending, approved, rejected)
router.get('/', (req, res) => {
  const { status } = req.query;
  const requests = db.getVerificationRequests(status);
  res.json({ success: true, count: requests.length, data: requests });
});

// Admin decision on verification request
router.post('/:id/decision', (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    const updated = db.updateVerificationRequest(req.params.id, status, notes || '');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Verification request not found' });
    }

    res.json({
      success: true,
      message: `Verification request ${status === 'approved' ? 'Approved & Entity Verified' : 'Rejected'}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
