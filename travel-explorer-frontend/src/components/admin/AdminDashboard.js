import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [currentFeedbackPage, setCurrentFeedbackPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);

    useEffect(() => {
        if (user?.isAdmin) {
            loadDashboardStats();
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'feedback') {
            loadFeedback();
        }
    }, [activeTab, currentUserPage, currentFeedbackPage]);

    const loadDashboardStats = async () => {
        try {
            const response = await fetch('https://travelexplore.onrender.com/api/admin/users/stats', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://travelexplore.onrender.com/api/admin/users/users?page=${currentUserPage}&limit=10`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
                setUserTotalPages(data.pagination.totalPages);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const loadFeedback = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://travelexplore.onrender.com/api/admin/users/feedback?page=${currentFeedbackPage}&limit=10`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setFeedback(data.feedback);
                setFeedbackTotalPages(data.pagination.totalPages);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Error loading feedback:', err);
            setError('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await fetch(`https://travelexplore.onrender.com/api/admin/users/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                loadUsers(); // Reload users
            }
        } catch (err) {
            console.error('Error updating user role:', err);
        }
    };

    const updateFeedbackStatus = async (feedbackId, newStatus, responseText = '') => {
        try {
            const response = await fetch(`https://travelexplore.onrender.com/api/admin/users/feedback/${feedbackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    status: newStatus,
                    ...(responseText && { response: responseText })
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                loadFeedback(); // Reload feedback
            }
        } catch (err) {
            console.error('Error updating feedback:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateString);
    };

    if (!user?.isAdmin) {
        return (
            <div className="admin-dashboard">
                <div className="access-denied">
                    <h2>🔒 Access Denied</h2>
                    <p>You need administrator privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users, feedback, and system analytics</p>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feedback')}
                >
                    💬 Feedback
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
                <div className="dashboard-stats">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <h3>{stats.totalUsers}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-info">
                                <h3>{stats.activeUsers}</h3>
                                <p>Active Users</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">👑</div>
                            <div className="stat-info">
                                <h3>{stats.adminUsers}</h3>
                                <p>Admin Users</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💬</div>
                            <div className="stat-info">
                                <h3>{stats.totalFeedback}</h3>
                                <p>Total Feedback</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-info">
                                <h3>{stats.pendingFeedback}</h3>
                                <p>Pending Feedback</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-info">
                                <h3>{stats.todayLogins}</h3>
                                <p>Today's Logins</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="users-section">
                    <h2>User Management</h2>
                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : (
                        <>
                            <div className="users-table-container">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Last Login</th>
                                            <th>Last Logout</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="user-info">
                                                        <strong>{user.name}</strong>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <select 
                                                        value={user.role}
                                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                        className="role-select"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {user.lastLogin ? (
                                                        <span title={formatDate(user.lastLogin)}>
                                                            {getTimeAgo(user.lastLogin)}
                                                        </span>
                                                    ) : 'Never'}
                                                </td>
                                                <td>
                                                    {user.lastLogout ? (
                                                        <span title={formatDate(user.lastLogout)}>
                                                            {getTimeAgo(user.lastLogout)}
                                                        </span>
                                                    ) : 'Never'}
                                                </td>
                                                <td title={formatDate(user.createdAt)}>
                                                    {getTimeAgo(user.createdAt)}
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn-view-logins"
                                                        onClick={() => {/* Implement login history modal */}}
                                                        title="View Login History"
                                                    >
                                                        📋
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {userTotalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        disabled={currentUserPage === 1}
                                        onClick={() => setCurrentUserPage(prev => prev - 1)}
                                    >
                                        ← Previous
                                    </button>
                                    <span>Page {currentUserPage} of {userTotalPages}</span>
                                    <button 
                                        disabled={currentUserPage === userTotalPages}
                                        onClick={() => setCurrentUserPage(prev => prev + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
                <div className="feedback-section">
                    <h2>Feedback Management</h2>
                    {loading ? (
                        <div className="loading">Loading feedback...</div>
                    ) : (
                        <>
                            <div className="feedback-list">
                                {feedback.map(item => (
                                    <div key={item._id} className="feedback-card">
                                        <div className="feedback-header">
                                            <div className="user-info">
                                                <strong>{item.userName}</strong>
                                                <span className="user-email">{item.userEmail}</span>
                                            </div>
                                            <div className="feedback-meta">
                                                <span className={`status-badge ${item.status}`}>
                                                    {item.status}
                                                </span>
                                                <span className="category-badge">{item.category}</span>
                                                <span className="rating">⭐ {item.rating}/5</span>
                                            </div>
                                        </div>
                                        
                                        <div className="feedback-content">
                                            <h4>{item.subject}</h4>
                                            <p>{item.message}</p>
                                        </div>

                                        <div className="feedback-dates">
                                            <small>Submitted: {formatDate(item.createdAt)}</small>
                                            {item.respondedAt && (
                                                <small>Responded: {formatDate(item.respondedAt)}</small>
                                            )}
                                        </div>

                                        {item.response && (
                                            <div className="admin-response">
                                                <strong>Admin Response:</strong>
                                                <p>{item.response}</p>
                                            </div>
                                        )}

                                        <div className="feedback-actions">
                                            <select 
                                                value={item.status}
                                                onChange={(e) => updateFeedbackStatus(item._id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                            
                                            <button 
                                                className="btn-respond"
                                                onClick={() => {
                                                    const response = prompt('Enter your response:');
                                                    if (response) {
                                                        updateFeedbackStatus(item._id, 'reviewed', response);
                                                    }
                                                }}
                                            >
                                                💬 Respond
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {feedbackTotalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        disabled={currentFeedbackPage === 1}
                                        onClick={() => setCurrentFeedbackPage(prev => prev - 1)}
                                    >
                                        ← Previous
                                    </button>
                                    <span>Page {currentFeedbackPage} of {feedbackTotalPages}</span>
                                    <button 
                                        disabled={currentFeedbackPage === feedbackTotalPages}
                                        onClick={() => setCurrentFeedbackPage(prev => prev + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;