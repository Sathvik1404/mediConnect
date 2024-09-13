import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import img from './user-doctor-solid (1).svg';
import pat from './hospital-user-solid (1).svg';

const LandingPage = () => {
    const navigate = useNavigate();

    const toDoc = () => {
        navigate('./doctor/Dlogin');
    };

    const toPatient = () => {
        navigate('/patient/login');
    };

    return (
        <>
            <div className="footer">
                <div className="logo">
                    <p>mediConnect</p>
                </div>
                <marquee behavior="" direction="" className="marquee">
                    mediConnect: Where Patients and Doctors Connect Together
                </marquee>
            </div>
            <div className="landing-page">
                <div className="doctor-card" onClick={toDoc}>
                    <img src={img} alt="doctor" height={"125px"} width={"125px"} />
                    <h1>Doctor</h1>
                </div>
                <div className="patient-card" onClick={toPatient}>
                    <img src={pat} alt="patient" height={"125px"} width={"125px"} />
                    <h1>Patient</h1>
                </div>
                <div className="card card-left">
                    <h1>medi</h1>
                    <p>Your Health Is</p>
                </div>
                <div className="card card-right">
                    <h1>Connect</h1>
                    <p>Our Priority</p>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
