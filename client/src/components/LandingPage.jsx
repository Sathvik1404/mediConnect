import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import img from './user-doctor-solid (1).svg';
import pat from './hospital-user-solid (1).svg';
import hsp from './hospital-solid.svg';
const LandingPage = () => {
    const navigate = useNavigate();

    const toDoc = () => {
        navigate('./doctor/Dlogin');
    };

    const toPatient = () => {
        navigate('/patient/login');
    };
    const toHospital = () => {
        navigate('/hospital/register/Register');
    }
    return (
        <>
            <marquee behavior="" direction="" className="marquee">
                mediConnect: Where Patients and Doctors Connect Together
            </marquee>
            <div className="landing-page">
                <div className="second">
                    <div className="patient-card" onClick={toPatient}>
                        <img src={pat} alt="patient" height={"125px"} width={"125px"} />
                        <h1>Patient</h1>
                    </div>
                    <div className="hospital-card" onClick={toHospital}>
                        <img src={hsp} alt="doctor" height={"125px"} width={"125px"} />
                        <h1>Hospital</h1>
                    </div>
                    <div className="doctor" onClick={toDoc}>
                        <img src={img} alt="doctor" height={"125px"} width={"125px"} />
                        <h1>Doctor</h1>
                    </div>
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
                {/* <div className="link-line"> */}

            </div>
        </>
    );
};

export default LandingPage;