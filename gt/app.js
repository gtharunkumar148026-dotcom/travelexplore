const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const adminUsersRoutes = require('./routes/admin-users');
const searchHistoryRoutes = require('./routes/searchHistory');
const favoritesRoutes = require('./routes/favorites');
const blogsRoutes = require('./routes/blogs');
const userRoutes = require('./routes/user');
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ Created public directory');
}

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travelDB';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// ✅ CORS Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Session Configuration
// ✅ Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'travel_explorer_secret_2024_change_this_in_production',
  resave: true, // Changed to true for better session handling
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  },
  store: new session.MemoryStore(),
  // Add these for better session handling
  proxy: true, // If behind reverse proxy like nginx
  name: 'travelExplorer.sid' // Custom session cookie name
}));
// ✅ Body Parsing Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// ✅ Security Middleware
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ✅ Serve static files
app.use(express.static(publicDir, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/user', userRoutes);
// ✅ Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Travel Explorer Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ✅ User Status Endpoint
app.get('/api/user-status', (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      email: req.session.userEmail,
      isAdmin: req.session.isAdmin,
      userId: req.session.userId
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ Serve React App (for production)
// ✅ Serve React Frontend
app.use(express.static(path.join(__dirname, '../travel-explorer-frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../travel-explorer-frontend/build/index.html')
  );
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Entry',
      message: 'A record with this information already exists'
    });
  }
  
  res.status(err.status || 500).json({ 
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// ✅ 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl 
  });
});

// ✅ Debug endpoint to check sessions
app.get('/api/debug-session', (req, res) => {
  console.log('🔍 Session debug:', {
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie
  });
  
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie
  });
});
// ✅ Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎉 Travel Explorer Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  MongoDB: ${MONGODB_URI}`);
  console.log(`\n🌐 Frontend URLs:`);
  console.log(`   Home: http://localhost:${PORT}/`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`\n📝 API Endpoints:`);
  console.log(`   Register: http://localhost:${PORT}/api/auth/register`);
  console.log(`   Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`   User Status: http://localhost:${PORT}/api/user-status`);
  console.log(`   Search History: http://localhost:${PORT}/api/search-history`);
  console.log(`   Favorites: http://localhost:${PORT}/api/favorites`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

module.exports = app;