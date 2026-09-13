const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all subscription packages
router.get('/plans', (req, res) => {
  const plans = db.getSubscriptionPlans();
  res.json({ success: true, data: plans });
});

// Get user subscriptions
router.get('/user/:userId', (req, res) => {
  const subs = db.getUserSubscriptions(req.params.userId);
  res.json({ success: true, data: subs });
});

// Subscribe to a package
router.post('/subscribe', (req, res) => {
  try {
    const { userId, planId, centerId } = req.body;
    if (!userId || !planId) {
      return res.status(400).json({ success: false, message: 'userId and planId are required' });
    }

    const plan = db.getSubscriptionPlans().find(p => p.id === planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    let centerName = 'Any Network Center';
    if (centerId) {
      const center = db.getCenterById(centerId);
      if (center) centerName = center.name;
    }

    const sub = db.createUserSubscription({
      userId,
      planId: plan.id,
      planName: plan.name,
      hoursTotal: plan.hoursIncluded,
      hoursRemaining: plan.hoursIncluded,
      monthlyCost: plan.monthlyPrice,
      associatedCenterId: centerId || null,
      associatedCenterName: centerName
    });

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${plan.name} plan!`,
      data: sub
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
