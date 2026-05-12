import React, { useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/login';
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
            <div className="w3-display-topleft w3-padding-large w3-xlarge" style={{color: 'blue'}}>
                Welcome 
            </div>
            <div className="w3-display-topright w3-padding-large">
                <a href="sign.html">
                    <button className="btn">signup/register</button>
                </a>
            </div>
            <div className="w3-display-middle">
                <h1 className="w3-jumbo w3-animate-top">Travel explore</h1>
                <hr className="w3-border-grey" style={{margin: 'auto', width: '40%'}} />
                <p className="w3-large w3-center">Find the places</p>
            </div>
            <div className="w3-display-bottomleft w3-padding-large">
                Made By <a href="https://www.w3schools.com/spaces" target="_blank" rel="noopener noreferrer">Travel explore team</a>
            </div>
        </div>
    );
};

export default WelcomePage;