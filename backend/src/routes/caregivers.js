const express = require('express');
const router = express.Router();
const db = require('../db');

// List caregivers (optional centerId filter)
router.get('/', (req, res) => {
  const centerId = req.query.centerId;
  const caregivers = db.getCaregivers(centerId);
  res.json({ success: true, count: caregivers.length, data: caregivers });
});

// Get caregiver by id
router.get('/:id', (req, res) => {
  const caregiver = db.getCaregiverById(req.params.id);
  if (!caregiver) {
    return res.status(404).json({ success: false, message: 'Caregiver not found' });
  }
  res.json({ success: true, data: caregiver });
});

// Create caregiver
router.post('/', (req, res) => {
  try {
    const caregiver = db.createCaregiver(req.body);
    res.status(201).json({ success: true, message: 'Caregiver added successfully', data: caregiver });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update caregiver
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateCaregiver(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Caregiver not found' });
    }
    res.json({ success: true, message: 'Caregiver updated', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
