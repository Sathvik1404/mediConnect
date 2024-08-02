import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="card card-left">
                <h1>medi</h1>
                <p>Your Health</p>
            </div>
            <div className="card card-right">
                <h1>Connect</h1>
                <p>Our Priority</p>
            </div>
            <div className="link-line"></div>
        </div>
    );
};

export default LandingPage;
