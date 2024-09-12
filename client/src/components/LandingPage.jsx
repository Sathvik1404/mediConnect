import React from 'react';
import './LandingPage.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img from './user-doctor-solid (1).svg'
import { useNavigate } from 'react-router-dom';
import pat from './hospital-user-solid (1).svg'
const LandingPage = () => {

    const navigate = useNavigate();

    const toDoc = () => {
        navigate('./doctor/Dlogin')
    }

    const toPatient = () => {
        navigate('/patient/login');
    }
    return (
        <>
            <div className="footer">
                <div className='logo'>
                    <p>hello</p>
                </div>
                <marquee behavior="" direction="" className="marquee">mediConect Where both Patients and Doctors Connect Together</marquee></div>
            <div className="landing-page">
                <div className="doctor-card">
                    <img src={img} alt="doctor" height={"125px"} width={"125px"} onClick={toDoc} />
                    <h1>Doctor</h1>
                </div>
                <div className="patient-card">
                    <img src={pat} alt="patient" height={"125px"} width={"125px"} onClick={toPatient} />
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
        </>
    );
};

export default LandingPage;
