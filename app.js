const dotenv = require("dotenv");
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/User/userRoutes');
const adminRoutes = require('./routes/Admin/adminRoutes');
const { ensureDefaultAdmin } = require('./controllers/Admin/adminController');


// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Ensure default admin exists with fixed credentials
  ensureDefaultAdmin().catch(() => {})
});

// Middleware to parse JSON
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Example route
app.get('/', (req, res) => {
  res.send('Hello,running!')
});

// Example POST route
app.post('/api/data', (req, res) => {
  const data = req.body
  res.json({ message: 'Data received successfully!', data })
});

// User routes
app.use('/api/users', userRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});
