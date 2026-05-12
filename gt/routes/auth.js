const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Test registration route (simple version)
router.post('/test-register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('🧪 TEST REGISTRATION STARTED:', { name, email });
    
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    console.log('👤 Creating user in database...');
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password
    });

    console.log('✅ TEST - User created successfully:', user._id);

    // Set session
    console.log('🔐 Setting session data...');
    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    req.session.isAdmin = user.role === 'admin';

    console.log('📋 Session data set:', {
      userId: req.session.userId,
      userEmail: req.session.userEmail,
      userName: req.session.userName,
      isAdmin: req.session.isAdmin
    });

    // Manual session save
    req.session.save((err) => {
      if (err) {
        console.error('❌ TEST - Session save error:', err);
        return res.status(500).json({
          success: false,
          message: 'Session save failed'
        });
      }

      console.log('✅ TEST - Session saved successfully');
      
      res.json({
        success: true,
        message: 'Test registration successful!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        sessionInfo: {
          sessionId: req.sessionID,
          userId: req.session.userId
        }
      });
    });

  } catch (error) {
    console.error('❌ TEST REGISTRATION ERROR:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Test registration failed',
      error: error.message
    });
  }
});

// Main Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    console.log('🔄 REGISTRATION STARTED:', { 
      name, 
      email, 
      hasPassword: !!password,
      hasConfirmPassword: !!confirmPassword 
    });

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    // Check if user already exists
    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    console.log('👤 Creating user in database...');
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password
    });

    console.log('✅ User created successfully:', user._id);

    // Set session data
    console.log('🔐 Setting session data...');
    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    req.session.isAdmin = user.role === 'admin';

    console.log('📋 Session data set:', {
      userId: req.session.userId,
      userEmail: req.session.userEmail,
      userName: req.session.userName,
      isAdmin: req.session.isAdmin
    });

    // Save session
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        // Even if session save fails, we can still return success
        // The user can login again to establish a new session
        console.log('⚠️ Session save failed but user was created');
        
        return res.status(201).json({
          success: true,
          message: 'Registration successful! Please login to continue.',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'admin'
          },
          sessionWarning: 'Session not established, please login'
        });
      }

      console.log('✅ Session saved successfully');
      console.log('🎉 Registration completed successfully');
      
      res.status(201).json({
        success: true,
        message: 'Registration successful!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === 'admin'
        }
      });
    });

  } catch (error) {
    console.error('💥 REGISTRATION ERROR:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.log('❌ Validation error:', messages);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }

    if (error.code === 11000) {
      console.log('❌ Duplicate email error');
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    console.log('❌ Server error during registration');
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔄 LOGIN ATTEMPT:', { email });

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user
    console.log('🔍 Finding user...');
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    console.log('🔐 Checking password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account inactive:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    // Set session data
    console.log('🔐 Setting session data...');
    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    req.session.isAdmin = user.role === 'admin';

    console.log('📋 Session data set:', {
      userId: req.session.userId,
      userEmail: req.session.userEmail,
      userName: req.session.userName,
      isAdmin: req.session.isAdmin
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Save session
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error during login:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Session error during login' 
        });
      }

      console.log('✅ Login successful for user:', user._id);
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === 'admin'
        }
      });
    });

  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    console.log('🔄 LOGOUT ATTEMPT for user:', req.session.userId);
    
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Logout error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Logout failed' 
        });
      }
      
      res.clearCookie('travelExplorer.sid');
      console.log('✅ Logout successful');
      
      res.json({ 
        success: true, 
        message: 'Logout successful' 
      });
    });
  } catch (error) {
    console.error('💥 LOGOUT ERROR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
});

// Verify session endpoint
router.get('/verify-session', (req, res) => {
  console.log('🔐 SESSION VERIFICATION REQUEST');
  console.log('   Session ID:', req.sessionID);
  console.log('   Session data:', req.session);
  console.log('   Cookies:', req.headers.cookie);
  
  if (req.session.userId) {
    console.log('✅ Valid session found for user:', req.session.userId);
    res.json({
      success: true,
      message: 'Session is valid',
      session: {
        userId: req.session.userId,
        userEmail: req.session.userEmail,
        userName: req.session.userName,
        isAdmin: req.session.isAdmin,
        sessionId: req.sessionID
      }
    });
  } else {
    console.log('❌ No valid session found');
    res.json({
      success: false,
      message: 'No valid session',
      session: req.session
    });
  }
});

// Submit feedback
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, message, subject, rating, category } = req.body;

    console.log('📨 FEEDBACK SUBMISSION:', { name, email, subject, category });

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // For now, just log the feedback since we don't have the Feedback model
    console.log('✅ Feedback received (would save to database):', {
      userName: name,
      userEmail: email,
      subject: subject || 'General Feedback',
      message: message.substring(0, 100) + '...', // Log first 100 chars
      rating: rating || 5,
      category: category || 'general',
      userId: req.session.userId || 'anonymous'
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        id: 'temp_' + Date.now(),
        userName: name,
        subject: subject || 'General Feedback',
        category: category || 'general',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ FEEDBACK SUBMISSION ERROR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit feedback',
      error: error.message 
    });
  }
});

// Debug endpoint to check current session
router.get('/debug', (req, res) => {
  console.log('🐛 DEBUG ENDPOINT HIT');
  console.log('   Full Request Headers:', req.headers);
  console.log('   Session ID:', req.sessionID);
  console.log('   Full Session:', JSON.stringify(req.session, null, 2));
  console.log('   Cookies:', req.headers.cookie);
  
  res.json({
    success: true,
    debug: {
      sessionId: req.sessionID,
      session: req.session,
      headers: {
        cookie: req.headers.cookie,
        'user-agent': req.headers['user-agent']
      },
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;