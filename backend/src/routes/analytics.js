const express = require('express');
const router = express.Router();
const db = require('../db');

// Platform-wide Admin Analytics & KPIs
router.get('/', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Center-specific Provider Analytics
router.get('/center/:centerId', (req, res) => {
  try {
    const center = db.getCenterById(req.params.centerId);
    if (!center) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }

    const bookings = db.getBookings({ centerId: center.id });
    const completed = bookings.filter(b => b.status === 'completed');
    const checkedIn = bookings.filter(b => b.status === 'checked_in');
    const pending = bookings.filter(b => b.status === 'pending_provider_approval');
    const confirmed = bookings.filter(b => b.status === 'confirmed');

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const caregivers = db.getCaregivers(center.id);

    // Calculate room utilization
    let totalCap = 0;
    let occCap = 0;
    if (center.capacity) {
      Object.values(center.capacity).forEach(r => {
        totalCap += (r.total || 0);
        occCap += (r.occupied || 0);
      });
    }
    const utilizationRate = totalCap > 0 ? Math.round((occCap / totalCap) * 100) : 0;

    res.json({
      success: true,
      data: {
        centerId: center.id,
        centerName: center.name,
        rating: center.rating,
        reviewCount: center.reviewCount,
        totalBookings: bookings.length,
        checkedInCount: checkedIn.length,
        pendingApprovalsCount: pending.length,
        upcomingConfirmedCount: confirmed.length,
        completedCount: completed.length,
        totalRevenue,
        caregiverCount: caregivers.length,
        utilizationRate,
        capacity: center.capacity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
