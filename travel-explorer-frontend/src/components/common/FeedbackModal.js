import React, { useState } from 'react';
import { authService } from '../../services/auth';
import './FeedbackModal.css';

const FeedbackModal = ({ onClose, user }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
        rating: 5,
        category: 'general'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            console.log('🔄 Starting feedback submission...');
            
            const result = await authService.submitFeedback({
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                rating: parseInt(formData.rating),
                category: formData.category
            });

            console.log('✅ Feedback submission result:', result);

            if (result.success) {
                setSuccess('🎉 Thank you for your feedback! We appreciate your input.');
                
                // Reset form
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    subject: '',
                    message: '',
                    rating: 5,
                    category: 'general'
                });

                // Auto close after 2 seconds
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to submit feedback. Please try again.');
            }
        } catch (err) {
            console.error('❌ Feedback submission error:', err);
            setError(err.message || 'Failed to submit feedback. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal">
                <div className="feedback-modal-header">
                    <h3>💬 Share Your Feedback</h3>
                    <button className="close-btn" onClick={onClose} disabled={loading}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                    {error && (
                        <div className="alert alert-error">
                            ❌ {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success">
                            ✅ {success}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Your Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Your Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Enter your email address"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="general">General Feedback</option>
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="suggestion">Suggestion</option>
                                <option value="complaint">Complaint</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rating">Rating</label>
                            <select
                                id="rating"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                                <option value="3">⭐⭐⭐ (3/5)</option>
                                <option value="2">⭐⭐ (2/5)</option>
                                <option value="1">⭐ (1/5)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject *</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief description of your feedback"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Message *</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Please share your detailed feedback, suggestions, or issues..."
                            required
                            disabled={loading}
                        />
                        <div className="char-count">
                            {formData.message.length}/1000 characters
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;