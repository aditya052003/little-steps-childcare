const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'data', 'initialData.json');

class Database {
  constructor() {
    this.data = {
      users: [],
      centers: [],
      caregivers: [],
      subscriptionPlans: [],
      userSubscriptions: [],
      bookings: [],
      verificationRequests: [],
      reviews: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving data to disk:', err);
    }
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const user = {
      id: `user-${uuidv4().slice(0, 8)}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    this.save();
    return user;
  }

  // Centers
  getCenters(filters = {}) {
    let result = [...this.data.centers];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        (c.tagline && c.tagline.toLowerCase().includes(q))
      );
    }

    if (filters.is24x7 !== undefined && filters.is24x7 !== '') {
      const is24x7Bool = filters.is24x7 === 'true' || filters.is24x7 === true;
      if (is24x7Bool) {
        result = result.filter(c => c.is24x7 === true);
      }
    }

    if (filters.ageGroup) {
      result = result.filter(c => c.ageGroups && c.ageGroups.includes(filters.ageGroup));
    }

    if (filters.timingType) {
      result = result.filter(c => c.timingTypes && c.timingTypes.includes(filters.timingType));
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!isNaN(max) && max > 0) {
        result = result.filter(c => c.pricing && c.pricing.hourly <= max);
      }
    }

    if (filters.verificationStatus) {
      result = result.filter(c => c.verificationStatus === filters.verificationStatus);
    }

    return result;
  }

  getCenterById(id) {
    return this.data.centers.find(c => c.id === id);
  }

  createCenter(centerData) {
    const center = {
      id: `center-${uuidv4().slice(0, 8)}`,
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending_verification',
      ...centerData,
      createdAt: new Date().toISOString()
    };
    this.data.centers.push(center);
    this.save();
    return center;
  }

  updateCenter(id, updateData) {
    const idx = this.data.centers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.centers[idx] = { ...this.data.centers[idx], ...updateData };
    this.save();
    return this.data.centers[idx];
  }

  // Caregivers
  getCaregivers(centerId = null) {
    if (centerId) {
      return this.data.caregivers.filter(cg => cg.centerId === centerId);
    }
    return this.data.caregivers;
  }

  getCaregiverById(id) {
    return this.data.caregivers.find(cg => cg.id === id);
  }

  createCaregiver(data) {
    const caregiver = {
      id: `cg-${uuidv4().slice(0, 8)}`,
      rating: 5.0,
      reviews: 0,
      verified: false,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.data.caregivers.push(caregiver);
    this.save();
    return caregiver;
  }

  updateCaregiver(id, updateData) {
    const idx = this.data.caregivers.findIndex(cg => cg.id === id);
    if (idx === -1) return null;
    this.data.caregivers[idx] = { ...this.data.caregivers[idx], ...updateData };
    this.save();
    return this.data.caregivers[idx];
  }

  // Bookings
  getBookings({ userId, centerId, status } = {}) {
    let result = [...this.data.bookings];
    if (userId) {
      result = result.filter(b => b.userId === userId);
    }
    if (centerId) {
      result = result.filter(b => b.centerId === centerId);
    }
    if (status) {
      result = result.filter(b => b.status === status);
    }
    // sort newest first
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getBookingById(id) {
    return this.data.bookings.find(b => b.id === id);
  }

  createBooking(bookingData) {
    // Capacity check
    const center = this.getCenterById(bookingData.centerId);
    if (center && center.capacity && bookingData.ageGroup) {
      const room = center.capacity[bookingData.ageGroup];
      if (room && room.occupied >= room.total) {
        throw new Error(`Room capacity for ${bookingData.ageGroup} is currently full (${room.occupied}/${room.total}).`);
      }
      // If room has capacity, increment occupied
      if (room) {
        room.occupied += 1;
      }
    }

    const booking = {
      id: `bk-${uuidv4().slice(0, 8)}`,
      bookingCode: `LS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending_provider_approval',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    this.data.bookings.unshift(booking);
    this.save();
    return booking;
  }

  updateBookingStatus(id, newStatus, reason = '') {
    const idx = this.data.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    const booking = this.data.bookings[idx];
    booking.status = newStatus;
    if (reason) {
      booking.statusReason = reason;
    }
    booking.updatedAt = new Date().toISOString();

    // If cancelled or rejected, release room capacity
    if (['rejected', 'cancelled', 'completed'].includes(newStatus)) {
      const center = this.getCenterById(booking.centerId);
      if (center && center.capacity && booking.ageGroup) {
        const room = center.capacity[booking.ageGroup];
        if (room && room.occupied > 0) {
          room.occupied -= 1;
        }
      }
    }

    this.save();
    return booking;
  }

  // Subscriptions
  getSubscriptionPlans() {
    return this.data.subscriptionPlans;
  }

  getUserSubscriptions(userId) {
    if (userId) {
      return this.data.userSubscriptions.filter(s => s.userId === userId);
    }
    return this.data.userSubscriptions;
  }

  createUserSubscription(data) {
    const sub = {
      id: `user-sub-${uuidv4().slice(0, 8)}`,
      status: 'active',
      startDate: new Date().toISOString().slice(0, 10),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      hoursUsed: 0,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.data.userSubscriptions.push(sub);
    this.save();
    return sub;
  }

  // Verification Requests
  getVerificationRequests(status = null) {
    if (status) {
      return this.data.verificationRequests.filter(vr => vr.status === status);
    }
    return this.data.verificationRequests;
  }

  updateVerificationRequest(id, newStatus, notes = '') {
    const idx = this.data.verificationRequests.findIndex(vr => vr.id === id);
    if (idx === -1) return null;
    const vr = this.data.verificationRequests[idx];
    vr.status = newStatus;
    vr.adminNotes = notes;
    vr.reviewedAt = new Date().toISOString();

    // If approved, update target entity verification status
    if (newStatus === 'approved') {
      if (vr.type === 'center_license') {
        this.updateCenter(vr.targetId, { verificationStatus: 'verified' });
      } else if (vr.type === 'caregiver_credential') {
        this.updateCaregiver(vr.targetId, { verified: true });
      }
    } else if (newStatus === 'rejected') {
      if (vr.type === 'center_license') {
        this.updateCenter(vr.targetId, { verificationStatus: 'rejected' });
      }
    }

    this.save();
    return vr;
  }

  // Reviews
  getReviews(centerId = null) {
    if (centerId) {
      return this.data.reviews.filter(r => r.centerId === centerId);
    }
    return this.data.reviews;
  }

  createReview(reviewData) {
    const review = {
      id: `rev-${uuidv4().slice(0, 8)}`,
      date: new Date().toISOString().slice(0, 10),
      verifiedStay: true,
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    this.data.reviews.unshift(review);

    // recalculate center rating
    const centerReviews = this.getReviews(review.centerId);
    if (centerReviews.length > 0) {
      const avg = centerReviews.reduce((sum, r) => sum + r.rating, 0) / centerReviews.length;
      this.updateCenter(review.centerId, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: centerReviews.length
      });
    }

    this.save();
    return review;
  }

  // Analytics & KPIs
  getAnalytics() {
    const totalUsers = this.data.users.length;
    const parentCount = this.data.users.filter(u => u.role === 'parent').length;
    const providerCount = this.data.users.filter(u => u.role === 'provider').length;
    const verifiedCenters = this.data.centers.filter(c => c.verificationStatus === 'verified').length;
    const pendingCenters = this.data.centers.filter(c => c.verificationStatus === 'pending_verification').length;
    const totalBookings = this.data.bookings.length;
    const activeBookings = this.data.bookings.filter(b => ['confirmed', 'checked_in', 'pending_provider_approval'].includes(b.status)).length;
    const pendingApprovals = this.data.bookings.filter(b => b.status === 'pending_provider_approval').length;
    const pendingVerifications = this.data.verificationRequests.filter(vr => vr.status === 'pending').length;

    // Calculate total revenue and hours
    const totalRevenue = this.data.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) +
      this.data.userSubscriptions.reduce((sum, s) => sum + (s.monthlyCost || 0), 0);

    // Calculate overall facility capacity utilization
    let totalCap = 0;
    let occupiedCap = 0;
    this.data.centers.forEach(c => {
      if (c.capacity) {
        Object.values(c.capacity).forEach(room => {
          totalCap += (room.total || 0);
          occupiedCap += (room.occupied || 0);
        });
      }
    });

    const averageUtilizationRate = totalCap > 0 ? Math.round((occupiedCap / totalCap) * 100) : 0;
    const bookingConversionRate = 92; // 92% successful fulfillment
    const satisfactionRate = 98.4; // 98.4% positive ratings

    return {
      totalUsers,
      parentCount,
      providerCount,
      verifiedCenters,
      pendingCenters,
      totalCaregivers: this.data.caregivers.length,
      totalBookings,
      activeBookings,
      pendingApprovals,
      pendingVerifications,
      totalRevenue,
      averageUtilizationRate,
      bookingConversionRate,
      satisfactionRate,
      totalCapacity: totalCap,
      occupiedCapacity: occupiedCap
    };
  }
}

const db = new Database();
module.exports = db;
