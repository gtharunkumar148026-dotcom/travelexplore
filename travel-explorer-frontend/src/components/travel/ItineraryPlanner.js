import React, { useState } from 'react';
import './ItineraryPlanner.css';

const ItineraryPlanner = ({ destination }) => {
    const [itinerary, setItinerary] = useState([]);
    const [newActivity, setNewActivity] = useState({
        time: '',
        activity: '',
        location: '',
        notes: ''
    });

    const addActivity = () => {
        if (newActivity.time && newActivity.activity) {
            setItinerary([...itinerary, { ...newActivity, id: Date.now() }]);
            setNewActivity({ time: '', activity: '', location: '', notes: '' });
        }
    };

    const removeActivity = (id) => {
        setItinerary(itinerary.filter(activity => activity.id !== id));
    };

    const saveItinerary = () => {
        const itineraryData = {
            destination,
            date: new Date().toISOString(),
            activities: itinerary
        };
        localStorage.setItem(`itinerary-${destination}`, JSON.stringify(itineraryData));
        alert('Itinerary saved!');
    };

    return (
        <div className="itinerary-planner">
            <h4>Plan Your Itinerary for {destination}</h4>
            
            <div className="add-activity">
                <h5>Add Activity</h5>
                <div className="activity-form">
                    <input
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                        placeholder="Time"
                    />
                    <input
                        type="text"
                        value={newActivity.activity}
                        onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})}
                        placeholder="Activity"
                    />
                    <input
                        type="text"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                        placeholder="Location"
                    />
                    <input
                        type="text"
                        value={newActivity.notes}
                        onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                        placeholder="Notes"
                    />
                    <button onClick={addActivity}>Add</button>
                </div>
            </div>

            <div className="itinerary-list">
                <h5>Your Itinerary</h5>
                {itinerary.length === 0 ? (
                    <p>No activities planned yet</p>
                ) : (
                    itinerary.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-time">{activity.time}</div>
                            <div className="activity-details">
                                <strong>{activity.activity}</strong>
                                {activity.location && <div>📍 {activity.location}</div>}
                                {activity.notes && <div>📝 {activity.notes}</div>}
                            </div>
                            <button 
                                className="remove-btn"
                                onClick={() => removeActivity(activity.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>

            {itinerary.length > 0 && (
                <button className="save-btn" onClick={saveItinerary}>
                    Save Itinerary
                </button>
            )}
        </div>
    );
};

export default ItineraryPlanner;