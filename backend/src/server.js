const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const centersRoutes = require('./routes/centers');
const caregiversRoutes = require('./routes/caregivers');
const bookingsRoutes = require('./routes/bookings');
const subscriptionsRoutes = require('./routes/subscriptions');
const verificationRoutes = require('./routes/verification');
const analyticsRoutes = require('./routes/analytics');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Little Steps 24x7 Childcare Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/centers', centersRoutes);
app.use('/api/caregivers', caregiversRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Little Steps 24x7 Childcare Platform Backend Running  `);
  console.log(` Port: http://localhost:${PORT}                       `);
  console.log(` Health: http://localhost:${PORT}/api/health           `);
  console.log(`=======================================================`);
});

module.exports = app;
