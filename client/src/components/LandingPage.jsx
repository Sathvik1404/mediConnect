import React from 'react';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="card card-left">
                <h1>medi</h1>
                <p>Your Health Is</p>
            </div>
            <div>
            </div>
            <div className="card card-right">
                <h1>Connect</h1>
                <p>Our Priority</p>
            </div>
            {/* <div className="link-line"> */}
            <FontAwesomeIcon icon="fa-solid fa-link" />
        </div>
    );
};

export default LandingPage;
