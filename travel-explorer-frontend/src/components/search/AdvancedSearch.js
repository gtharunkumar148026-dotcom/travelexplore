import React, { useState } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearch, destinations }) => {
    const [filters, setFilters] = useState({
        budget: '',
        season: '',
        activity: '',
        duration: '',
        rating: '',
        searchTerm: ''
    });

    const activities = [
        'Beach', 'Mountain', 'City', 'Historical', 'Adventure', 
        'Cultural', 'Relaxation', 'Shopping', 'Food', 'Wildlife'
    ];

    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const budgets = ['Budget', 'Moderate', 'Luxury'];
    const durations = ['Weekend', '1 Week', '2 Weeks', '1 Month+'];
    const ratings = ['4+ Stars', '3+ Stars', 'Any'];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            budget: '',
            season: '',
            activity: '',
            duration: '',
            rating: '',
            searchTerm: ''
        };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const filteredDestinations = destinations.filter(dest => {
        if (filters.searchTerm && !dest.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }
        if (filters.budget && dest.budget !== filters.budget) {
            return false;
        }
        if (filters.season && !dest.bestSeasons?.includes(filters.season)) {
            return false;
        }
        if (filters.activity && !dest.activities?.includes(filters.activity)) {
            return false;
        }
        if (filters.rating) {
            const minRating = parseInt(filters.rating);
            if (dest.rating < minRating) return false;
        }
        return true;
    });

    return (
        <div className="advanced-search">
            <div className="search-header">
                <h3>Advanced Search</h3>
                <button className="clear-btn" onClick={clearFilters}>
                    Clear All
                </button>
            </div>

            <div className="search-filters">
                <div className="filter-group">
                    <label>Search Destination</label>
                    <input
                        type="text"
                        placeholder="Enter destination name..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Budget</label>
                    <select
                        value={filters.budget}
                        onChange={(e) => handleFilterChange('budget', e.target.value)}
                    >
                        <option value="">Any Budget</option>
                        {budgets.map(budget => (
                            <option key={budget} value={budget}>{budget}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Best Season</label>
                    <select
                        value={filters.season}
                        onChange={(e) => handleFilterChange('season', e.target.value)}
                    >
                        <option value="">Any Season</option>
                        {seasons.map(season => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Activities</label>
                    <select
                        value={filters.activity}
                        onChange={(e) => handleFilterChange('activity', e.target.value)}
                    >
                        <option value="">Any Activity</option>
                        {activities.map(activity => (
                            <option key={activity} value={activity}>{activity}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Trip Duration</label>
                    <select
                        value={filters.duration}
                        onChange={(e) => handleFilterChange('duration', e.target.value)}
                    >
                        <option value="">Any Duration</option>
                        {durations.map(duration => (
                            <option key={duration} value={duration}>{duration}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Minimum Rating</label>
                    <select
                        value={filters.rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                    >
                        <option value="">Any Rating</option>
                        {ratings.map(rating => (
                            <option key={rating} value={rating}>{rating}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="results-count">
                Found {filteredDestinations.length} destinations
            </div>
        </div>
    );
};

export default AdvancedSearch;