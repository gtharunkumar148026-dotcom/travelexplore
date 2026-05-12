import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navigation.css';

const Navigation = ({ onLogout, currentUser }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        setShowUserMenu(false);
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-black bg-white shadow-sm">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span className="me-2">🌍</span>
                    TravelExplorer
                </Link>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMenu}
                    aria-controls="navbarNav"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Content */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    {/* Navigation Links */}
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                🏠 Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${isActiveRoute('/explore') ? 'active' : ''}`}
                                to="/explore"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                🔍 Explore
                            </Link>
                        </li>
                        {user?.loggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActiveRoute('/favorites') ? 'active' : ''}`}
                                        to="/favorites"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        ❤️ Favorites
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActiveRoute('/history') ? 'active' : ''}`}
                                        to="/history"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        📚 History
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActiveRoute('/blogs') ? 'active' : ''}`}
                                        to="/blogs"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        📝 Travel Blog
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* User Menu / Auth Links */}
                    <ul className="navbar-nav">
                        {user?.loggedIn ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle btn btn-link text-dark text-decoration-none"
                                    onClick={toggleUserMenu}
                                    style={{ border: 'none', background: 'none' }}
                                >
                                    👤 {user.username || user.email}
                                </button>
                                <div className={`dropdown-menu dropdown-menu-end ${showUserMenu ? 'show' : ''}`}>
                                    <Link 
                                        className="dropdown-item" 
                                        to="/profile"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        👤 Profile
                                    </Link>
                                    {user.isAdmin && (
                                        <Link 
                                            className="dropdown-item" 
                                            to="/admin"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            ⚙️ Admin
                                        </Link>
                                    )}
                                    <div className="dropdown-divider"></div>
                                    <button 
                                        className="dropdown-item text-danger" 
                                        onClick={handleLogout}
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        🔑 Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        📝 Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;