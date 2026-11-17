const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load the root project environment file even when started through an npm workspace.
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static frontend files
const frontendPublicPath = path.resolve(__dirname, '..', 'frontend', 'public');
app.use(express.static(frontendPublicPath));
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/coding', require('./routes/codingRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/aptitude', require('./routes/aptitudeRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Keep unknown API paths as JSON errors instead of returning the frontend HTML.
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Serve the landing page for browser routes not mapped to a static file.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPublicPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  const statusCode = err.statusCode || err.status || (err.name === 'MulterError' ? 400 : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
======================================================
🚀 PlacePrep AI Backend Server Running!
📡 URL: http://localhost:${PORT}
📁 Environment: ${process.env.NODE_ENV || 'development'}
======================================================
  `);
});
