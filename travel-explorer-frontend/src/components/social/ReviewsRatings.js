import React, { useState, useEffect } from 'react';
import './ReviewsRatings.css';

const ReviewsRatings = ({ destination }) => {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({
        rating: 5,
        title: '',
        comment: '',
        visitDate: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [destination]);

    const loadReviews = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/reviews/${destination}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destination,
                    ...userReview
                }),
                credentials: 'include'
            });

            if (response.ok) {
                setUserReview({ rating: 5, title: '', comment: '', visitDate: '' });
                setShowForm(false);
                loadReviews();
                alert('Review submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="reviews-ratings">
            <div className="reviews-header">
                <h4>Reviews & Ratings</h4>
                <div className="rating-summary">
                    <div className="average-rating">
                        <span className="rating-number">{averageRating}</span>
                        <div className="stars">
                            {'★'.repeat(Math.round(averageRating))}
                            {'☆'.repeat(5 - Math.round(averageRating))}
                        </div>
                        <span className="review-count">({reviews.length} reviews)</span>
                    </div>
                </div>
                <button 
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    Write a Review
                </button>
            </div>

            {showForm && (
                <form onSubmit={submitReview} className="review-form">
                    <h5>Write Your Review</h5>
                    <div className="form-group">
                        <label>Rating</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-btn ${userReview.rating >= star ? 'active' : ''}`}
                                    onClick={() => setUserReview({...userReview, rating: star})}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Review Title</label>
                        <input
                            type="text"
                            value={userReview.title}
                            onChange={(e) => setUserReview({...userReview, title: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            value={userReview.comment}
                            onChange={(e) => setUserReview({...userReview, comment: e.target.value})}
                            rows="4"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Visit Date</label>
                        <input
                            type="month"
                            value={userReview.visitDate}
                            onChange={(e) => setUserReview({...userReview, visitDate: e.target.value})}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Submit Review</button>
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <strong>{review.userName}</strong>
                                    <div className="review-rating">
                                        {'★'.repeat(review.rating)}
                                        {'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                            </div>
                            <h5>{review.title}</h5>
                            <p>{review.comment}</p>
                            {review.visitDate && (
                                <small>Visited: {review.visitDate}</small>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsRatings;