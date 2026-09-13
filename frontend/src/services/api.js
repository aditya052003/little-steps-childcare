// Centralized API client for Little Steps 24x7 Childcare Platform

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${url}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth & Demo Users
  getUsers: () => request('/auth/users'),
  getUserById: (id) => request(`/auth/user/${id}`),
  login: (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Centers
  getCenters: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return request(`/centers${qs ? `?${qs}` : ''}`);
  },
  getCenterById: (id) => request(`/centers/${id}`),
  createCenter: (data) => request('/centers', { method: 'POST', body: JSON.stringify(data) }),
  updateCenter: (id, data) => request(`/centers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Caregivers
  getCaregivers: (centerId) => request(`/caregivers${centerId ? `?centerId=${centerId}` : ''}`),
  getCaregiverById: (id) => request(`/caregivers/${id}`),
  createCaregiver: (data) => request('/caregivers', { method: 'POST', body: JSON.stringify(data) }),
  updateCaregiver: (id, data) => request(`/caregivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Bookings
  getBookings: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });
    const qs = query.toString();
    return request(`/bookings${qs ? `?${qs}` : ''}`);
  },
  getBookingById: (id) => request(`/bookings/${id}`),
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBookingStatus: (id, status, reason) =>
    request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    }),

  // Subscriptions
  getSubscriptionPlans: () => request('/subscriptions/plans'),
  getUserSubscriptions: (userId) => request(`/subscriptions/user/${userId}`),
  subscribe: (data) => request('/subscriptions/subscribe', { method: 'POST', body: JSON.stringify(data) }),

  // Verification
  getVerificationRequests: (status) => request(`/verification${status ? `?status=${status}` : ''}`),
  decideVerification: (id, status, notes) =>
    request(`/verification/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ status, notes })
    }),

  // Analytics & KPIs
  getAdminAnalytics: () => request('/analytics'),
  getProviderAnalytics: (centerId) => request(`/analytics/center/${centerId}`),

  // Reviews
  getReviews: (centerId) => request(`/reviews${centerId ? `?centerId=${centerId}` : ''}`),
  submitReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) })
};
