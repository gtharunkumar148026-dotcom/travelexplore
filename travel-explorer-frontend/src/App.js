import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Components
import TravelInfoExplorer from './components/main/TravelInfoExplorer';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import WelcomePage from './components/main/WelcomePage';
import Profile from './components/user/Profile';
import TravelBlog from './components/social/TravelBlog';
import UserHistory from './components/user/UserHistory';
import Favorites from './components/user/Favorites';
import Navigation from './components/common/Navigation';

// App Content with conditional navigation
function AppContent() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    logout();
    // Redirect to home after logout
    navigate('/');
  };

  // Show navigation on all pages except login, signup, and welcome
  const showNavigation = !['/', '/login', '/sign', '/signup'].includes(location.pathname);

  return (
    <div className="App">
      {showNavigation && (
        <Navigation 
          onLogout={handleLogout}
          currentUser={user}
        />
      )}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/explore" element={<TravelInfoExplorer />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blogs" element={<TravelBlog />} />
        <Route path="/history" element={<UserHistory />} />
        <Route path="/favorites" element={<Favorites />} />
        
        {/* Redirect old HTML routes to new React routes */}
        <Route path="/front.html" element={<Navigate to="/explore" />} />
        <Route path="/login.html" element={<Navigate to="/login" />} />
        <Route path="/sign.html" element={<Navigate to="/signup" />} />
        <Route path="/admin.html" element={<Navigate to="/admin" />} />
        <Route path="/logo.html" element={<Navigate to="/" />} />
        <Route path="/history.html" element={<Navigate to="/history" />} />
        
        {/* Catch all route - redirect to explore */}
        <Route path="*" element={<Navigate to="/explore" />} />
      </Routes>
    </div>
  );
}

// Main App Wrapper
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;