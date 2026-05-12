import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BlogCard from './BlogCard';
import BlogEditor from './BlogEditor';
import './TravelBlog.css';

const TravelBlog = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadBlogs();
    }, [currentPage]);

    const loadBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/blogs?page=${currentPage}&limit=6`);
            if (response.ok) {
                const data = await response.json();
                setBlogs(data.blogs);
                setTotalPages(data.totalPages);
            } else {
                throw new Error('Failed to load blogs');
            }
        } catch (err) {
            console.error('Error loading blogs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBlogCreated = (newBlog) => {
        setBlogs(prev => [newBlog, ...prev]);
        setShowEditor(false);
    };

    const handleBlogUpdated = (updatedBlog) => {
        setBlogs(prev => prev.map(blog => 
            blog._id === updatedBlog._id ? updatedBlog : blog
        ));
    };

    const handleBlogDeleted = (blogId) => {
        setBlogs(prev => prev.filter(blog => blog._id !== blogId));
    };

    const handleLike = async (blogId) => {
        if (!user?.loggedIn) {
            alert('Please log in to like blogs');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/blogs/${blogId}/like`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                // Update the blog in the state
                setBlogs(prev => prev.map(blog => {
                    if (blog._id === blogId) {
                        return {
                            ...blog,
                            likesCount: result.liked ? blog.likesCount + 1 : blog.likesCount - 1
                        };
                    }
                    return blog;
                }));
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    return (
        <div className="travel-blog">
            {/* Header Section */}
            <div className="blog-header">
                <div className="container">
                    <h1>Travel Blog</h1>
                    <p>Share your travel experiences and discover amazing stories from other travelers</p>
                    
                    {user?.loggedIn && !showEditor && (
                        <button 
                            className="btn-create-blog"
                            onClick={() => setShowEditor(true)}
                        >
                            ✏️ Write New Blog
                        </button>
                    )}
                </div>
            </div>

            {/* Blog Editor */}
            {showEditor && (
                <BlogEditor 
                    onSave={handleBlogCreated}
                    onCancel={() => setShowEditor(false)}
                />
            )}

            {/* Blogs Section */}
            <div className="container">
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading blogs...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="no-blogs">
                        <div className="no-blogs-icon">📝</div>
                        <h3>No blogs yet</h3>
                        <p>Be the first to share your travel story!</p>
                        {user?.loggedIn && (
                            <button 
                                className="btn-create-blog"
                                onClick={() => setShowEditor(true)}
                            >
                                Write First Blog
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="blogs-grid">
                            {blogs.map(blog => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    onUpdate={handleBlogUpdated}
                                    onDelete={handleBlogDeleted}
                                    onLike={handleLike}
                                    currentUserId={user?.userId}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
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
        </div>
    );
};

export default TravelBlog;