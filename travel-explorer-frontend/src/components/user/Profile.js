import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        bio: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user?.loggedIn) return;

        try {
            const data = await authService.getProfile();
            if (data.success) {
                setProfile(data.user);
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            // Fallback to session data
            setProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await authService.updateProfile(profile);
            if (result.success) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
                // Update global user state
                updateUser({
                    ...user,
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    bio: profile.bio
                });
            } else {
                setError(result.message || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadProfile(); // Reset form
        setError('');
        setMessage('');
    };

    if (!user?.loggedIn) {
        return (
            <div className="profile-container">
                <div className="login-required">
                    <h2>Please log in to view your profile</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>👤 User Profile</h2>
                <p>Manage your personal information and preferences</p>
            </div>

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="profile-card">
                <div className="profile-actions">
                    {!isEditing ? (
                        <button 
                            className="btn-edit"
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Edit Profile
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button 
                                className="btn-cancel"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-save"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows="4"
                            placeholder="Tell us about yourself, your travel interests, etc."
                            maxLength="500"
                        />
                        <div className="char-count">
                            {profile.bio.length}/500 characters
                        </div>
                    </div>

                    {isEditing && (
                        <div className="form-group">
                            <div className="edit-note">
                                💡 Make your changes and click "Save Changes" to update your profile.
                            </div>
                        </div>
                    )}
                </form>

                <div className="profile-info">
                    <div className="info-item">
                        <strong>Member Since:</strong>
                        <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    <div className="info-item">
                        <strong>Role:</strong>
                        <span className={`role-badge ${user.role}`}>
                            {user.role || 'User'}
                        </span>
                    </div>
                    <div className="info-item">
                        <strong>Last Login:</strong>
                        <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;