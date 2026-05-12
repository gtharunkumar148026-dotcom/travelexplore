import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BlogEditor from './BlogEditor';

const BlogCard = ({ blog, onUpdate, onDelete, onLike, currentUserId }) => {
    const { user } = useAuth();
    const [showEditor, setShowEditor] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const isOwner = user?.loggedIn && blog.userId._id === currentUserId;

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        await onLike(blog._id);
        setIsLiking(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const response = await fetch(`https://travelexplore.onrender.com/api/blogs/${blog._id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    onDelete(blog._id);
                } else {
                    alert('Failed to delete blog');
                }
            } catch (err) {
                console.error('Error deleting blog:', err);
                alert('Error deleting blog');
            }
        }
    };

    const handleEdit = (updatedBlog) => {
        onUpdate(updatedBlog);
        setShowEditor(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="blog-card">
                {blog.image && (
                    <div className="blog-image">
                        <img src={blog.image} alt={blog.title} />
                    </div>
                )}
                
                <div className="blog-content">
                    <div className="blog-header">
                        <h3 className="blog-title">{blog.title}</h3>
                        {isOwner && (
                            <div className="blog-actions">
                                <button 
                                    className="btn-edit"
                                    onClick={() => setShowEditor(true)}
                                    title="Edit blog"
                                >
                                    ✏️
                                </button>
                                <button 
                                    className="btn-delete"
                                    onClick={handleDelete}
                                    title="Delete blog"
                                >
                                    🗑️
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="blog-meta">
                        <span className="author">By {blog.author}</span>
                        {blog.location && (
                            <span className="location">📍 {blog.location}</span>
                        )}
                        <span className="date">{formatDate(blog.createdAt)}</span>
                    </div>

                    <div className="blog-content-preview">
                        {blog.content.length > 200 
                            ? `${blog.content.substring(0, 200)}...` 
                            : blog.content
                        }
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="blog-tags">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}

                    <div className="blog-footer">
                        <button 
                            className={`btn-like ${isLiking ? 'loading' : ''}`}
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            ❤️ {blog.likesCount || 0}
                        </button>
                        <button className="btn-read-more">
                            Read Full Story →
                        </button>
                    </div>
                </div>
            </div>

            {showEditor && (
                <BlogEditor
                    editBlog={blog}
                    onSave={handleEdit}
                    onCancel={() => setShowEditor(false)}
                />
            )}
        </>
    );
};

export default BlogCard;