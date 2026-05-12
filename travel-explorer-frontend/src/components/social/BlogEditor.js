import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './BlogEditor.css';

const BlogEditor = ({ onSave, onCancel, editBlog = null }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: editBlog?.title || '',
        content: editBlog?.content || '',
        image: editBlog?.image || '',
        location: editBlog?.location || '',
        tags: editBlog?.tags?.join(', ') || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.loggedIn) {
            alert('Please log in to create a blog');
            return;
        }

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const blogData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                image: formData.image.trim(),
                location: formData.location.trim(),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const url = editBlog 
                ? `https://travelexplore.onrender.com/api/blogs/${editBlog._id}`
                : 'https://travelexplore.onrender.com/api/blogs';
            
            const method = editBlog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
                credentials: 'include'
            });

            if (response.ok) {
                const savedBlog = await response.json();
                onSave(savedBlog);
                setFormData({
                    title: '',
                    content: '',
                    image: '',
                    location: '',
                    tags: ''
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save blog');
            }
        } catch (err) {
            console.error('Error saving blog:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-editor-overlay">
            <div className="blog-editor">
                <div className="editor-header">
                    <h2>{editBlog ? 'Edit Blog' : 'Write New Blog'}</h2>
                    <button className="btn-close" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="blog-form">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">Blog Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter an engaging title..."
                            required
                            maxLength="100"
                        />
                        <small>{formData.title.length}/100 characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Where did you travel?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/your-image.jpg"
                        />
                        {formData.image && (
                            <div className="image-preview">
                                <img src={formData.image} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Blog Content *</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Share your amazing travel experience..."
                            rows="12"
                            required
                        />
                        <small>{formData.content.length} characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="beach, mountains, adventure, culture (comma separated)"
                        />
                    </div>

                    <div className="editor-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-publish"
                            disabled={loading || !formData.title.trim() || !formData.content.trim()}
                        >
                            {loading ? 'Publishing...' : (editBlog ? 'Update Blog' : 'Publish Blog')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogEditor;