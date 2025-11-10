const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/User/userRoutes');
const adminRoutes = require('./routes/Admin/adminRoutes');
const { ensureDefaultAdmin } = require('./controllers/Admin/adminController');

// Import new routes
const addressRoutes = require('./routes/User/addressRoutes');
const cartRoutes = require('./routes/User/cartRoutes');
const orderRoutes = require('./routes/User/orderRoutes');
const productRoutes = require('./routes/Public/productRoutes');
const couponRoutes = require('./routes/Public/couponRoutes');
const bannerRoutes = require('./routes/Public/bannerRoutes');
const testimonialRoutes = require('./routes/Public/testimonialRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Ensure default admin exists with fixed credentials
  ensureDefaultAdmin().catch(() => {})
});

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Harshavardhan Photography API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      addresses: '/api/addresses',
      coupons: '/api/coupons',
      banners: '/api/banners',
      testimonials: '/api/testimonials',
    }
  })
});

// API Routes
// Public routes (no authentication required)
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/testimonials', testimonialRoutes);

// User routes (authentication required)
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}`)
});
