import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './ProfessionalHeader.css';

const ProfessionalHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showDestinationsMenu, setShowDestinationsMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setShowUserMenu(false);
    };

    const popularDestinations = [
        { 
            name: 'Bali', 
            country: 'Indonesia', 
            type: 'Beach', 
            image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
            description: 'Island of Gods with stunning beaches'
        },
        { 
            name: 'Paris', 
            country: 'France', 
            type: 'City', 
            image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80',
            description: 'The romantic city of lights'
        },
        { 
            name: 'Tokyo', 
            country: 'Japan', 
            type: 'City', 
            image: 'https://images.unsplash.com/photo-1540959733332-45b2f6e7f5e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            description: 'Blend of tradition and modernity'
        },
        { 
            name: 'Santorini', 
            country: 'Greece', 
            type: 'Island', 
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
            description: 'Stunning sunsets and white architecture'
        }
    ];

    const travelTypes = [
        { name: 'Beach Holidays', icon: '🏖️', count: '1.2K+' },
        { name: 'Mountain Trekking', icon: '⛰️', count: '800+' },
        { name: 'City Breaks', icon: '🏙️', count: '2.5K+' },
        { name: 'Cultural Tours', icon: '🏛️', count: '950+' },
        { name: 'Adventure Sports', icon: '🚵', count: '600+' },
        { name: 'Luxury Resorts', icon: '🌟', count: '400+' }
    ];

    return (
        <header className={`professional-header navbar navbar-expand-lg navbar-dark fixed-top ${scrolled ? 'scrolled' : ''}`}>
            {/* Background Image Layer */}
            <div className="header-background"></div>
            
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-compass me-2"></i>
                    TravelExplorer
                </Link>

                {/* Mobile Toggle */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarMain"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Main Navigation */}
                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="fas fa-home me-1"></i>
                                Home
                            </Link>
                        </li>
                        
                        {/* Destinations Mega Menu */}
                        <li 
                            className="nav-item dropdown"
                            onMouseEnter={() => setShowDestinationsMenu(true)}
                            onMouseLeave={() => setShowDestinationsMenu(false)}
                        >
                            <button 
                                className="nav-link dropdown-toggle"
                                type="button"
                            >
                                <i className="fas fa-map-marked-alt me-1"></i>
                                Destinations
                            </button>
                            
                            {showDestinationsMenu && (
                                <div className="dropdown-menu mega-menu show">
                                    <div className="container-fluid">
                                        <div className="row">
                                            {/* Popular Destinations */}
                                            <div className="col-lg-8">
                                                <h6 className="mega-menu-title">Popular Destinations</h6>
                                                <div className="row">
                                                    {popularDestinations.map((dest, index) => (
                                                        <div key={index} className="col-lg-6 mb-3">
                                                            <div 
                                                                className="destination-card"
                                                                onClick={() => {
                                                                    navigate(`/explore?destination=${dest.name}`);
                                                                    setShowDestinationsMenu(false);
                                                                }}
                                                            >
                                                                <div 
                                                                    className="destination-image"
                                                                    style={{ backgroundImage: `url(${dest.image})` }}
                                                                >
                                                                    <div className="destination-overlay">
                                                                        <h6 className="mb-1">{dest.name}</h6>
                                                                        <small>{dest.country}</small>
                                                                    </div>
                                                                </div>
                                                                <div className="destination-info">
                                                                    <p className="mb-0">{dest.description}</p>
                                                                    <span className="destination-type">{dest.type}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Travel Types */}
                                            <div className="col-lg-4">
                                                <h6 className="mega-menu-title">Travel Types</h6>
                                                <div className="travel-types">
                                                    {travelTypes.map((type, index) => (
                                                        <div key={index} className="travel-type-item">
                                                            <span className="travel-icon">{type.icon}</span>
                                                            <div className="travel-info">
                                                                <span className="travel-name">{type.name}</span>
                                                                <small className="travel-count">{type.count} trips</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/explore">
                                <i className="fas fa-search me-1"></i>
                                Explore
                            </Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/blogs">
                                <i className="fas fa-blog me-1"></i>
                                Travel Blogs
                            </Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">
                                <i className="fas fa-info-circle me-1"></i>
                                About
                            </Link>
                        </li>
                    </ul>

                    {/* Search Bar */}
                    <div className="search-container me-3">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search destinations, blogs, guides..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/explore?search=${e.target.value}`);
                                }
                            }}
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>

                    {/* User Menu */}
                    <div className="user-menu">
                        {user ? (
                            <div 
                                className="user-avatar"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                onMouseEnter={() => setShowUserMenu(true)}
                            >
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                
                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div 
                                        className="dropdown-menu show"
                                        onMouseLeave={() => setShowUserMenu(false)}
                                    >
                                        <div className="user-info">
                                            <h6 className="mb-1">{user.name}</h6>
                                            <small className="text-muted">{user.email}</small>
                                            {user.isAdmin && (
                                                <span className="badge bg-primary mt-1">Admin</span>
                                            )}
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link 
                                            className="dropdown-item" 
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <i className="fas fa-user me-2"></i>
                                            My Profile
                                        </Link>
                                        <Link 
                                            className="dropdown-item" 
                                            to="/profile?tab=history"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <i className="fas fa-history me-2"></i>
                                            Search History
                                        </Link>
                                        <Link 
                                            className="dropdown-item" 
                                            to="/profile?tab=favorites"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <i className="fas fa-heart me-2"></i>
                                            Favorites
                                        </Link>
                                        {user.isAdmin && (
                                            <Link 
                                                className="dropdown-item" 
                                                to="/admin"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <i className="fas fa-cog me-2"></i>
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button 
                                            className="dropdown-item text-danger"
                                            onClick={handleLogout}
                                        >
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-outline-light btn-sm me-2">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Login
                                </Link>
                                <Link to="/sign" className="btn btn-light btn-sm">
                                    <i className="fas fa-user-plus me-1"></i>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification Bell */}
            {user && (
                <div className="notification-bell">
                    <i className="fas fa-bell"></i>
                    <span className="notification-badge">3</span>
                </div>
            )}
        </header>
    );
};

export default ProfessionalHeader;