import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { searchHistoryService } from '../../services/searchHistory';
import './UserHistory.css';

const UserHistory = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'destinations', 'recent', 'popular'

    useEffect(() => {
        if (user?.loggedIn) {
            loadHistory();
            loadStats();
        }
    }, [user, currentPage, activeTab]);

    const loadHistory = async () => {
        if (!user?.loggedIn) return;
        
        setLoading(true);
        setError(null);
        try {
            let data;
            
            switch (activeTab) {
                case 'recent':
                    data = await searchHistoryService.getRecentSearches();
                    setHistory(data.history || []);
                    setTotalPages(1);
                    break;
                case 'popular':
                    data = await searchHistoryService.getPopularDestinations();
                    setHistory(data.popular || []);
                    setTotalPages(1);
                    break;
                default:
                    data = await searchHistoryService.getSearchHistory(currentPage, 12);
                    setHistory(data.history || []);
                    setTotalPages(data.totalPages || 1);
                    break;
            }
        } catch (err) {
            console.error('Error loading history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        if (!user?.loggedIn) return;
        
        try {
            const data = await searchHistoryService.getHistoryStats();
            setStats(data.stats);
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const deleteHistoryItem = async (historyId) => {
        if (!window.confirm('Are you sure you want to remove this from your history?')) {
            return;
        }

        try {
            await searchHistoryService.deleteHistoryItem(historyId);
            setHistory(prev => prev.filter(item => item._id !== historyId));
            loadStats(); // Refresh stats
        } catch (err) {
            console.error('Error deleting history item:', err);
            alert('Failed to delete history item');
        }
    };

    const clearAllHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all your search history? This action cannot be undone.')) {
            return;
        }

        try {
            await searchHistoryService.clearAllHistory();
            setHistory([]);
            setStats(null);
            loadStats();
            alert('All search history cleared successfully');
        } catch (err) {
            console.error('Error clearing history:', err);
            alert('Failed to clear history');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'destination': return '🏝️';
            case 'attraction': return '🏛️';
            case 'city': return '🏙️';
            case 'landmark': return '🗼';
            default: return '🔍';
        }
    };

    if (!user?.loggedIn) {
        return (
            <div className="user-history-container">
                <div className="history-header">
                    <h2>Search History</h2>
                </div>
                <div className="login-required">
                    <p>Please log in to view your search history</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-history-container">
            {/* Header Section */}
            <div className="history-header">
                <div className="header-content">
                    <h2>Search History</h2>
                    <p>Your recently explored destinations and searches</p>
                </div>
                
                {stats && (
                    <div className="history-stats">
                        <div className="stat-item">
                            <span className="stat-number">{stats.totalSearches}</span>
                            <span className="stat-label">Total Searches</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{stats.todaySearches}</span>
                            <span className="stat-label">Today</span>
                        </div>
                        {stats.mostViewed && (
                            <div className="stat-item">
                                <span className="stat-number">{stats.mostViewed.viewCount}</span>
                                <span className="stat-label">Most Viewed</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="history-actions">
                <div className="history-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                    >
                        All History
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('recent'); setCurrentPage(1); }}
                    >
                        Recent
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('popular'); setCurrentPage(1); }}
                    >
                        Most Viewed
                    </button>
                </div>
                
                {history.length > 0 && (
                    <button 
                        className="btn-clear-all"
                        onClick={clearAllHistory}
                    >
                        🗑️ Clear All
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* History Content */}
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your history...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="no-history">
                    <div className="no-history-icon">🕐</div>
                    <h3>No search history yet</h3>
                    <p>Start exploring destinations to build your history!</p>
                </div>
            ) : (
                <>
                    <div className="history-grid">
                        {history.map((item) => (
                            <div key={item._id} className="history-card">
                                <div className="history-image">
                                    {item.image ? (
                                        <img 
                                            src={item.image} 
                                            alt={item.title}
                                            onError={(e) => {
                                                e.target.src = 'https://source.unsplash.com/300x200/?travel,' + encodeURIComponent(item.title);
                                            }}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            {getTypeIcon(item.type)}
                                        </div>
                                    )}
                                    <div className="history-type">
                                        {getTypeIcon(item.type)} {item.type}
                                    </div>
                                </div>
                                
                                <div className="history-content">
                                    <h3 className="history-title">{item.title}</h3>
                                    
                                    {item.description && (
                                        <p className="history-description">
                                            {item.description.length > 100 
                                                ? `${item.description.substring(0, 100)}...` 
                                                : item.description
                                            }
                                        </p>
                                    )}
                                    
                                    <div className="history-meta">
                                        <div className="view-count">
                                            👁️ {item.viewCount} {item.viewCount === 1 ? 'view' : 'views'}
                                        </div>
                                        <div className="last-viewed">
                                            {formatDate(item.lastViewedAt)}
                                        </div>
                                    </div>
                                    
                                    {item.metadata && (
                                        <div className="history-tags">
                                            {item.metadata.hasWikipedia && (
                                                <span className="tag wikipedia">📚 Wikipedia</span>
                                            )}
                                            {item.metadata.fromCard && (
                                                <span className="tag card">🎴 From Card</span>
                                            )}
                                            {item.metadata.wikipediaFailed && (
                                                <span className="tag fallback">ℹ️ General Info</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="history-actions-card">
                                    <button 
                                        className="btn-remove-item"
                                        onClick={() => deleteHistoryItem(item._id)}
                                        title="Remove from history"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination (only for all history tab) */}
                    {activeTab === 'all' && totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                ← Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserHistory;