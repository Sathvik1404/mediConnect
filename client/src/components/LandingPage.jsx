import React from 'react';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img from './user-doctor-solid (1).svg'
import pat from './hospital-user-solid (1).svg'
const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="doctor-card">
                <img src={img} alt="doctor" height={"125px"} width={"125px"} />
                <h1>Doctor</h1>
            </div>
            <div className="patient-card">
                <img src={pat} alt="patient" height={"125px"} width={"125px"} />
                <h1>Patient</h1>

            </div>
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
        </div>
    );
};

export default LandingPage;
