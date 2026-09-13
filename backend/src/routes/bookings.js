const express = require('express');
const router = express.Router();
const db = require('../db');

// List bookings with filters (userId, centerId, status)
router.get('/', (req, res) => {
  try {
    const { userId, centerId, status } = req.query;
    const bookings = db.getBookings({ userId, centerId, status });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Single booking by ID
router.get('/:id', (req, res) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

// Create new childcare booking (Hourly, Daily, Night-shift, Emergency Drop-in)
router.post('/', (req, res) => {
  try {
    const {
      userId,
      parentName,
      parentPhone,
      childId,
      childName,
      childAge,
      ageGroup,
      centerId,
      centerName,
      slotType,
      date,
      startTime,
      endTime,
      totalHours,
      ratePerHour,
      totalAmount,
      appliedSubscription,
      specialInstructions
    } = req.body;

    if (!userId || !centerId || !date || !ageGroup) {
      return res.status(400).json({
        success: false,
        message: 'userId, centerId, date, and ageGroup are required fields'
      });
    }

    const booking = db.createBooking({
      userId,
      parentName: parentName || 'Verified Parent',
      parentPhone: parentPhone || '+1 (555) 000-0000',
      childId: childId || 'child-default',
      childName: childName || 'Little One',
      childAge: childAge || 'Toddler',
      ageGroup,
      centerId,
      centerName: centerName || 'Partner Daycare',
      slotType: slotType || 'hourly',
      date,
      startTime: startTime || '09:00',
      endTime: endTime || '17:00',
      totalHours: totalHours || 4,
      ratePerHour: ratePerHour || 18,
      totalAmount: totalAmount || 72,
      appliedSubscription: appliedSubscription || null,
      specialInstructions: specialInstructions || ''
    });

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully and sent to the childcare center!',
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update booking status (confirmed, rejected, checked_in, completed, cancelled)
router.patch('/:id/status', (req, res) => {
  try {
    const { status, reason } = req.body;
    const validStatuses = ['pending_provider_approval', 'confirmed', 'checked_in', 'completed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = db.updateBookingStatus(req.params.id, status, reason);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
