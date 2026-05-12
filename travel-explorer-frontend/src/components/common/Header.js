import React from 'react';
import './Header.css';

const Header = ({ 
    title, 
    subtitle, 
    backgroundImage, 
    onSearch, 
    searchQuery, 
    onSearchChange 
}) => {
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch && searchQuery) {
            onSearch(searchQuery);
        }
    };

    const handleInputChange = (e) => {
        if (onSearchChange) {
            onSearchChange(e.target.value);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
    };

    return (
        <header 
            className="travel-header" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="header-overlay">
                <div className="container">
                    <div className="header-content">
                        <h1 className="header-title">{title}</h1>
                        <p className="header-subtitle">{subtitle}</p>
                        
                        {/* Search Bar in Header */}
                        <div className="header-search-container">
                            <form onSubmit={handleSearchSubmit} className="header-search-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control header-search-input"
                                        placeholder="Search destinations, cities, landmarks..."
                                        value={searchQuery || ''}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary header-search-btn"
                                    >
                                        🔍 Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;