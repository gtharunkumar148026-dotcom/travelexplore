import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ destination }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (destination) {
            fetchWeather(destination);
        }
    }, [destination]);

    const fetchWeather = async (place) => {
        setLoading(true);
        try {
            // Using OpenWeatherMap API (you'll need to get a free API key)
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(place)}&units=metric&appid=YOUR_API_KEY`
            );
            
            if (response.ok) {
                const data = await response.json();
                setWeather({
                    temperature: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    icon: data.weather[0].icon,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed
                });
            }
        } catch (error) {
            console.error('Weather fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!destination) return null;

    return (
        <div className="weather-widget">
            <h4>Weather in {destination}</h4>
            {loading ? (
                <div className="weather-loading">Loading weather...</div>
            ) : weather ? (
                <div className="weather-content">
                    <div className="weather-main">
                        <img 
                            src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                            alt={weather.description}
                        />
                        <div className="weather-temp">{weather.temperature}°C</div>
                    </div>
                    <div className="weather-desc">{weather.description}</div>
                    <div className="weather-details">
                        <div>Humidity: {weather.humidity}%</div>
                        <div>Wind: {weather.windSpeed} m/s</div>
                    </div>
                </div>
            ) : (
                <div className="weather-unavailable">
                    Weather data unavailable
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;