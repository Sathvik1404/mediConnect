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
        navigate('/hospital/Hlogin');
    };

    return (
        <div className="landing-page container-fluid">
            <header className="text-center my-4">
                <h1 className="display-4  mt-2">mediConnect</h1>
                <marquee className="text-warning">Where Patients and Doctors Connect Together</marquee>
            </header>

            <div className="hero-section text-center mb-5">
                <h2>Welcome to Your Health Hub</h2>
                <p>Connecting Patients, Doctors, and Hospitals for Better Care</p>
                <button className="btn btn-light btn-lg" onClick={toPatient}>Get Started</button>
            </div>

            {/* Cards Container */}
            <div className="row justify-content-center mb-2">
                <div className="col-md-4 mb-4">
                    <div className="card text-center hospital-card pt-5" onClick={toPatient}>
                        <img src={pat} alt="Illustration of a patient" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">Patient</h5>
                            <p>Access your health records and connect with doctors.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-center hospital-card pt-5" onClick={toHospital}>
                        <img src={hsp} alt="Illustration of a hospital" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">Hospital</h5>
                            <p>Manage your hospital's operations efficiently.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card text-center hospital-card pt-5" onClick={toDoc}>
                        <img src={img} alt="Illustration of a doctor" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">Doctor</h5>
                            <p>Consult with patients and manage appointments.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <section className="testimonials text-center mb-4 ">
                <h3>What Our Users Say</h3>
                {/* Add testimonial content here */}
            </section>

            {/* Footer */}
            <footer className="text-center mt-3">
                <p>&copy; 2024 mediConnect. All Rights Reserved.</p>
                {/* Add social media links here */}
            </footer>
        </div>
    );
};

export default LandingPage;
