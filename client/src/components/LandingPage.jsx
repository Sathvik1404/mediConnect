import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import img from './user-doctor-solid (1).svg';
import pat from './hospital-user-solid (1).svg';
import hsp from './hospital-solid.svg';

const LandingPage = () => {
    const navigate = useNavigate();

    const toDoc = () => {
        navigate('/doctor/Dlogin');
    };

    const toPatient = () => {
        navigate('/patient/login');
    };

    const toHospital = () => {
        navigate('/hospital/signup');
    };

    return (
        <div className="landing-page">
            <header className="name">
                <h6>mediConnect</h6>
                <marquee>Where Patients and Doctors Connect Together</marquee>
            </header>

            {/* Tagline Container Positioning */}
            <div className="tagline-container">
                <div className="card card-left">
                    <h1>medi</h1>
                    <p>Your Health Is</p>
                </div>
                <div className="card card-right">
                    <h1>Connect</h1>
                    <p>Our Priority</p>
                </div>
            </div>

            {/* Cards Container */}
            <div className="cards-container">
                <div className="patient-card" onClick={toPatient}>
                    <img src={pat} alt="Illustration of a patient" />
                    <h1>Patient</h1>
                </div>
                <div className="hospital-card" onClick={toHospital}>
                    <img src={hsp} alt="Illustration of a hospital" />
                    <h1>Hospital</h1>
                </div>
                <div className="doctor-card" onClick={toDoc}>
                    <img src={img} alt="Illustration of a doctor" />
                    <h1>Doctor</h1>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
