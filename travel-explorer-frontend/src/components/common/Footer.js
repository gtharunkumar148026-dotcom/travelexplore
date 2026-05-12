import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import FeedbackModal from './FeedbackModal';
import './Footer.css';

const Footer = ({ companyName = "TravelInfo Explorer", year = new Date().getFullYear() }) => {
  const { user } = useAuth();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h5>{companyName}</h5>
              <p>Discover amazing destinations and plan your perfect trip with our travel exploration platform.</p>
            </div>
            
            <div className="footer-section">
              <h6>Quick Links</h6>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore">Destinations</a></li>
                <li><a href="/blogs">Travel Blogs</a></li>
                <li><a href="/history">Travel History</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h6>Support</h6>
              <ul className="footer-links">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li>
                  <button 
                    className="feedback-link-btn"
                    onClick={() => setShowFeedbackModal(true)}
                  >
                    💬 Give Feedback
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h6>Connect With Us</h6>
              <div className="social-links">
                <a href="https://www.facebook.com/travelexplore.in/" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                <a href="https://twitter.com/search?q=%23travelnexplore&src=hashtag_click" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/travelandleisure/?hl=en" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://uk.linkedin.com/company/explore-worldwide" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {year} {companyName}. All rights reserved.</p>
            <p className="made-by">
              Made ❤️ by the Travel Explore Team
            </p>
          </div>
        </div>
      </footer>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal 
          onClose={() => setShowFeedbackModal(false)}
          user={user}
        />
      )}
    </>
  );
};

export default Footer;