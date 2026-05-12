import React, { useState } from 'react';
import './PhotoGallery.css';

const PhotoGallery = ({ destination }) => {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // Simulate upload - in real app, upload to cloud storage
            const newPhoto = {
                id: Date.now(),
                url: URL.createObjectURL(file),
                caption: '',
                uploadDate: new Date().toISOString(),
                destination
            };
            
            setPhotos(prev => [newPhoto, ...prev]);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const updateCaption = (photoId, caption) => {
        setPhotos(prev => prev.map(photo => 
            photo.id === photoId ? { ...photo, caption } : photo
        ));
    };

    const deletePhoto = (photoId) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    };

    return (
        <div className="photo-gallery">
            <div className="gallery-header">
                <h4>Photo Gallery - {destination}</h4>
                <div className="upload-section">
                    <label htmlFor="photo-upload" className="upload-btn">
                        {uploading ? 'Uploading...' : '📷 Upload Photo'}
                    </label>
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {photos.length === 0 ? (
                <div className="empty-gallery">
                    <p>No photos yet. Be the first to share your photos from {destination}!</p>
                </div>
            ) : (
                <div className="gallery-grid">
                    {photos.map(photo => (
                        <div key={photo.id} className="photo-item">
                            <img 
                                src={photo.url} 
                                alt={photo.caption || destination}
                                onClick={() => setSelectedPhoto(photo)}
                            />
                            <div className="photo-actions">
                                <input
                                    type="text"
                                    placeholder="Add a caption..."
                                    value={photo.caption}
                                    onChange={(e) => updateCaption(photo.id, e.target.value)}
                                    className="caption-input"
                                />
                                <button 
                                    className="delete-btn"
                                    onClick={() => deletePhoto(photo.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPhoto && (
                <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button 
                            className="close-btn"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            ×
                        </button>
                        <img src={selectedPhoto.url} alt={selectedPhoto.caption} />
                        {selectedPhoto.caption && (
                            <div className="modal-caption">{selectedPhoto.caption}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;