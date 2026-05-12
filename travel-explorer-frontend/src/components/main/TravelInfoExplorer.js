import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { travelService } from '../../services/travel';
import { authService } from '../../services/auth';
import { DESTINATIONS } from '../../utils/constants';
import { searchHistoryService } from '../../services/searchHistory';
import FavoriteButton from '../common/FavoriteButton';
import './TravelInfoExplorer.css';

const TravelInfoExplorer = () => {
    const { user } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [activeSection, setActiveSection] = useState('destinations');
    const [bookingData, setBookingData] = useState(null);
    const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setDestinations(DESTINATIONS);
    }, []);

    const resetSearch = () => {
        setSearchResults(null);
        setActiveSection('destinations');
        setSearchQuery('');
        setBookingData(null);
    };

    // Enhanced search history saving function
    const saveSearchToHistory = async (query, additionalData = {}) => {
        if (!user?.loggedIn) return;
        
        try {
            const result = await searchHistoryService.saveSearch(query, {
                title: additionalData.title || query,
                type: additionalData.type || 'destination',
                description: additionalData.description || '',
                image: additionalData.image || additionalData.thumbnail || '',
                metadata: {
                    hasWikipedia: additionalData.hasWikipedia || false,
                    wikipediaFailed: additionalData.wikipediaFailed || false,
                    extract: additionalData.extract || '',
                    thumbnail: additionalData.thumbnail || '',
                    fromCard: additionalData.fromCard || false,
                    isFeedback: additionalData.isFeedback || false,
                    timestamp: new Date().toISOString(),
                    ...additionalData.metadata
                }
            });
            
            if (result && result.success) {
                console.log('✅ Search saved to history:', query);
            } else {
                console.warn('⚠️ Search history save warning:', result?.message || 'Unknown error');
            }
        } catch (historyError) {
            console.warn('❌ Failed to save search history (non-critical):', historyError.message);
        }
    };

    // Handle search from navigation
    const handleSearch = (query) => {
        console.log('🔍 Search triggered with query:', query);
        if (query && query.trim()) {
            setSearchQuery(query);
            searchPlace(query.trim());
        }
    };

    // Handle search input change from navigation
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const searchPlace = async (place) => {
        if (!place || !place.trim()) return;
        
        console.log('🚀 Starting search for:', place);
        setLoading(true);
        setActiveSection('searchResults');

        try {
            // Try to get data from travel service
            let data;
            try {
                console.log('📡 Calling travelService.searchPlace...');
                data = await travelService.searchPlace(place);
                console.log('📨 Received data:', data);
            } catch (serviceError) {
                console.warn('❌ Travel service failed, using fallback:', serviceError);
                // Create fallback data
                data = {
                    title: place,
                    extract: `${place} is a beautiful destination with rich culture and amazing attractions. Explore the local cuisine, historical sites, and natural beauty that make this place unique.`,
                    wikipediaFailed: true
                };
            }

            setSearchResults(data);
    
            // Save to search history with comprehensive data
            await saveSearchToHistory(place, {
                title: data.title || place,
                type: 'destination',
                description: data.extract ? data.extract.substring(0, 150) + '...' : `Travel information about ${place}`,
                image: data.thumbnail?.source || '',
                hasWikipedia: !data.wikipediaFailed,
                wikipediaFailed: data.wikipediaFailed || false,
                extract: data.extract ? data.extract.substring(0, 200) + '...' : '',
                thumbnail: data.thumbnail?.source || ''
            });
        } catch (error) {
            console.error('💥 Search failed:', error);
            
            // Create comprehensive fallback data
            setSearchResults({ 
                title: place,
                extract: `${place} offers a unique travel experience with diverse attractions, cultural heritage, and beautiful landscapes. Visitors can enjoy local cuisine, explore historical sites, and immerse themselves in the local culture. The destination provides various accommodation options and transportation facilities for a comfortable visit.`,
                wikipediaFailed: true
            });

            // Save fallback search to history
            await saveSearchToHistory(place, {
                title: place,
                type: 'destination',
                description: 'Travel destination with general information',
                metadata: {
                    wikipediaFailed: true
                }
            });
        } finally {
            setLoading(false);
        }

        showBookingOptions(place);
    };

    const showBookingOptions = (place) => {
        try {
            let bookingLinks;
            try {
                bookingLinks = travelService.getBookingOptions(place);
            } catch (error) {
                console.warn('❌ Booking service failed, using fallback:', error);
                bookingLinks = [];
            }

            if (!bookingLinks || bookingLinks.length === 0) {
                // Fallback booking options
                bookingLinks = [
                    {
                        name: `Hotels in ${place}`,
                        type: 'Accommodation',
                        price: '$$ - $$$',
                        url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place)}`
                    },
                    {
                        name: `Restaurants in ${place}`,
                        type: 'Dining',
                        price: '$ - $$$',
                        url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(place)} restaurants`
                    },
                    {
                        name: `Flights to ${place}`,
                        type: 'Transportation',
                        price: 'Varies',
                        url: `https://www.skyscanner.com/transport/flights/to/${encodeURIComponent(place.toLowerCase())}`
                    },
                    {
                        name: `Activities in ${place}`,
                        type: 'Experiences',
                        price: '$$ - $$$',
                        url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(place)}`
                    }
                ];
            }
            setBookingData(bookingLinks);
        } catch (error) {
            console.error('💥 Failed to get booking options:', error);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.submitFeedback(feedback);
            
            // Save feedback to search history
            await saveSearchToHistory('Feedback', {
                title: 'User Feedback',
                type: 'general',
                description: `Feedback submitted: ${feedback.message.substring(0, 100)}...`,
                metadata: {
                    isFeedback: true
                }
            });
            
            alert("✅ Thank you for your feedback!");
            setFeedback({ name: '', email: '', message: '' });
            setActiveSection('destinations');
        } catch (error) {
            console.error('💥 Feedback submission failed:', error);
            alert("❌ Failed to submit feedback. Please try again.");
        }
    };

    const handleExploreDestination = (destinationName) => {
        // Find destination image
        const destination = destinations.find(dest => dest.name === destinationName);
        
        // Save destination exploration to history
        saveSearchToHistory(destinationName, {
            title: destinationName,
            type: 'destination',
            description: `Explored destination ${destinationName} from card click`,
            image: destination?.image || '',
            metadata: {
                fromCard: true
            }
        });
        
        handleSearch(destinationName);
    };

    // Get tourist spots with comprehensive error handling
    const getTouristSpots = (place) => {
        try {
            const spots = travelService.getTouristSpots(place);
            if (spots && spots.length > 0) {
                return spots;
            }
        } catch (error) {
            console.warn('❌ Tourist spots service failed:', error);
        }

        // Return comprehensive fallback tourist spots
        return [
            {
                name: `${place} City Center`,
                type: 'Landmark',
                imagesUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+city+center+images&tbm=isch`,
                searchUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+tourist+attractions`
            },
            {
                name: `${place} Historical Museum`,
                type: 'Cultural',
                imagesUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+museum+images&tbm=isch`,
                searchUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+museums`
            },
            {
                name: `${place} Central Park`,
                type: 'Nature',
                imagesUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+park+images&tbm=isch`,
                searchUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+parks+gardens`
            },
            {
                name: `${place} Local Market`,
                type: 'Shopping',
                imagesUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+market+images&tbm=isch`,
                searchUrl: `https://www.google.com/search?q=${encodeURIComponent(place)}+shopping+markets`
            }
        ];
    };

    // Handle tourist spot click - save to history
    const handleTouristSpotClick = (spotName, place) => {
        saveSearchToHistory(spotName, {
            title: spotName,
            type: 'attraction',
            description: `${spotName} in ${place}`,
            metadata: {
                parentDestination: place,
                isAttraction: true
            }
        });
    };

    // Handle booking option click - save to history
    const handleBookingOptionClick = (bookingName, place) => {
        saveSearchToHistory(bookingName, {
            title: bookingName,
            type: 'booking',
            description: `Booking option for ${place}`,
            metadata: {
                parentDestination: place,
                isBooking: true
            }
        });
    };

    // Render Destinations
    const renderDestinations = () => (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {destinations.map((dest, index) => (
                <div key={index} className="col">
                    <div className="card destination-card h-100 shadow-sm">
                        <img 
                            src={dest.image} 
                            className="card-img-top destination-image" 
                            alt={dest.name}
                            onError={(e) => {
                                e.target.src = 'https://source.unsplash.com/400x300/?travel,' + encodeURIComponent(dest.name);
                            }}
                        />
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{dest.name}</h5>
                            <p className="card-text flex-grow-1">Click below to explore more about {dest.name}.</p>
                            <div className="destination-actions mt-auto">
                                <FavoriteButton
                                    itemId={dest.name.toLowerCase().replace(/\s+/g, '-')}
                                    itemType="destination"
                                    title={dest.name}
                                    description={`Explore beautiful ${dest.name}`}
                                    image={dest.image}
                                    size="small"
                                    showText={true}
                                />
                                <button 
                                    className="btn btn-outline-primary w-100 mt-2" 
                                    onClick={() => handleExploreDestination(dest.name)}
                                >
                                    Explore
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSearchResults = () => {
        if (!searchResults) return null;

        const touristSpots = getTouristSpots(searchResults.title);

        return (
            <section className="container my-5" id="searchResults">
                <div className="card mb-4">
                    <div className="card-body" id="info">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h3>{searchResults.title}</h3>
                                {searchResults.wikipediaFailed && (
                                    <span className="badge bg-warning text-dark ms-2">General Information</span>
                                )}
                            </div>
                            <FavoriteButton
                                itemId={searchResults.title.toLowerCase().replace(/\s+/g, '-')}
                                itemType="destination"
                                title={searchResults.title}
                                description={searchResults.extract}
                                image={searchResults.thumbnail?.source}
                                size="medium"
                                showText={true}
                            />
                        </div>
                        
                        {searchResults.wikipediaFailed && (
                            <div className="alert alert-info">
                                <strong>ℹ️ Information:</strong> Showing general travel information about {searchResults.title}.
                            </div>
                        )}
                        
                        <p className="lead">{searchResults.extract}</p>
                        
                        <div className="row mt-4">
                            <div className="col-md-8">
                                <h5>🌆 About {searchResults.title}</h5>
                                <p>
                                    {searchResults.title} offers a unique blend of cultural experiences, modern amenities, 
                                    and natural beauty. Visitors can explore historical landmarks, enjoy local cuisine, 
                                    and participate in various cultural activities that showcase the destination's heritage.
                                </p>

                                <h5 className="mt-4">🚗 Travel & Transportation</h5>
                                <p>
                                    The destination is well-connected with multiple transportation options including 
                                    international airports, railway stations, and highway networks. Local transport 
                                    includes buses, taxis, and ride-sharing services for convenient exploration.
                                </p>
                            </div>
                            <div className="col-md-4">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6>Quick Tips</h6>
                                        <ul className="list-unstyled small">
                                            <li>✅ Best time to visit: All year</li>
                                            <li>💰 Cost: Moderate</li>
                                            <li>🌤️ Climate: Varied</li>
                                            <li>🗣️ Language: Local & English</li>
                                            <li>🍽️ Food: Diverse cuisine</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <a 
                                className="btn btn-primary me-2 mb-2" 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchResults.title)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => saveSearchToHistory(`Directions to ${searchResults.title}`, {
                                    title: `Directions to ${searchResults.title}`,
                                    type: 'navigation',
                                    metadata: { isNavigation: true }
                                })}
                            >
                                📍 Get Directions
                            </a>
                            <a 
                                className="btn btn-outline-secondary me-2 mb-2" 
                                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(searchResults.title)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => saveSearchToHistory(`Wikipedia: ${searchResults.title}`, {
                                    title: `Wikipedia: ${searchResults.title}`,
                                    type: 'reference',
                                    metadata: { isWikipedia: true }
                                })}
                            >
                                📚 Try Wikipedia
                            </a>
                            <a 
                                className="btn btn-outline-info mb-2" 
                                href={`https://www.google.com/search?q=${encodeURIComponent(searchResults.title)}+travel+guide`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => saveSearchToHistory(`Travel Guide: ${searchResults.title}`, {
                                    title: `Travel Guide: ${searchResults.title}`,
                                    type: 'reference',
                                    metadata: { isTravelGuide: true }
                                })}
                            >
                                🔍 More Info
                            </a>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">🏛️ Popular Tourist Spots in {searchResults.title}</h5>
                        <div className="row g-3">
                            {touristSpots.map((spot, index) => (
                                <div key={index} className="col-12">
                                    <div className="p-3 border rounded d-flex justify-content-between align-items-center">
                                        <div className="flex-grow-1">
                                            <h6 className="text-primary mb-1">{spot.name}</h6>
                                            <span className="badge bg-light text-dark">{spot.type}</span>
                                            <p className="text-muted mb-0 mt-1 small">
                                                Discover this {spot.type.toLowerCase()} in {searchResults.title}
                                            </p>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <FavoriteButton
                                                itemId={spot.name.toLowerCase().replace(/\s+/g, '-')}
                                                itemType="attraction"
                                                title={spot.name}
                                                description={`${spot.type} in ${searchResults.title}`}
                                                size="small"
                                                showText={false}
                                            />
                                            <a 
                                                href={spot.imagesUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleTouristSpotClick(spot.name, searchResults.title)}
                                            >
                                                📸 Images
                                            </a>
                                            <a 
                                                href={spot.searchUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleTouristSpotClick(spot.name, searchResults.title)}
                                            >
                                                🔍 Info
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title mb-3">🗺️ Location Map</h5>
                        <div className="ratio ratio-16x9">
                            <iframe 
                                src={`https://www.google.com/maps?q=${encodeURIComponent(searchResults.title)}&output=embed`} 
                                allowFullScreen 
                                loading="lazy"
                                title={`Map of ${searchResults.title}`}
                                style={{ border: 'none', borderRadius: '8px' }}
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button className="btn btn-secondary btn-lg" onClick={resetSearch}>
                        ← Back to All Destinations
                    </button>
                </div>
            </section>
        );
    };

    const renderBookingSection = () => {
        if (!bookingData) return null;

        return (
            <section className="container my-5" id="bookingSection">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title mb-4">🏨 Booking Options</h3>
                        <div className="row g-4">
                            {bookingData.map((booking, index) => (
                                <div key={index} className="col-md-6 col-lg-3">
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body d-flex flex-column">
                                            <h6 className="card-title text-primary">{booking.name}</h6>
                                            <p className="card-text flex-grow-1">
                                                <small className="text-muted">Type: {booking.type}</small><br />
                                                <small className="text-success">Price: {booking.price}</small>
                                            </p>
                                            <div className="booking-actions">
                                                <FavoriteButton
                                                    itemId={booking.name.toLowerCase().replace(/\s+/g, '-')}
                                                    itemType="booking"
                                                    title={booking.name}
                                                    description={`${booking.type} - ${booking.price}`}
                                                    size="small"
                                                    showText={false}
                                                />
                                                <a 
                                                    href={booking.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="btn btn-success w-100 mt-2 btn-sm"
                                                    onClick={() => handleBookingOptionClick(booking.name, searchResults.title)}
                                                >
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderFeedbackSection = () => (
        <section className="container my-5" id="feedbackSection">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title mb-4 text-primary">💬 Feedback Form</h2>
                    <form onSubmit={handleFeedbackSubmit} className="p-4 border rounded shadow-sm bg-light">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Your Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="name" 
                                value={feedback.name}
                                onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Your Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                value={feedback.email}
                                onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Your Feedback</label>
                            <textarea 
                                className="form-control" 
                                id="message" 
                                rows="4" 
                                value={feedback.message}
                                onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                                required
                            ></textarea>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">Submit Feedback</button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setActiveSection('destinations')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );

    return (
        <div className="travel-explorer">
            {/* Fixed: Header with search functionality */}
            <Header
                title="Explore the World"
                subtitle="Discover beautiful destinations across the globe"
                backgroundImage="https://source.unsplash.com/1600x600/?travel,explore"
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />

            <main className="main-content">
                {/* Loading Indicator */}
                {loading && (
                    <div className="text-center my-5 py-5">
                        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 h5">Searching for information about {searchQuery}...</p>
                    </div>
                )}

                {/* Content Sections */}
                {!loading && activeSection === 'destinations' && (
                    <section className="container my-5" id="destinations">
                        <h2 className="mb-4 section-title">🌟 Top Destinations</h2>
                        {renderDestinations()}
                    </section>
                )}

                {!loading && activeSection === 'searchResults' && (
                    <>
                        {renderSearchResults()}
                        {renderBookingSection()}
                    </>
                )}

                {!loading && activeSection === 'feedback' && renderFeedbackSection()}
            </main>

            <Footer />
        </div>
    );
};

export default TravelInfoExplorer;