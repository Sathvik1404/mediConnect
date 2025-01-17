import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import img from './user-doctor-solid (1).svg';
import pat from './hospital-user-solid (1).svg';
import hsp from './hospital-solid.svg';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';

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
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue == "Doctor") {
            toDoc();
        } else if (selectedValue == "Patient") {
            toPatient();
        } else if (selectedValue == "Hospital") {
            toHospital();
        }
    }
    return (
        <div className="landing-page container-fluid">
            <header className="text-center mb-2" >
                <img src="https://tse1.mm.bing.net/th?id=OIP.d_YIGvnUUzIk7Sq_0pGGPQHaC-&pid=Api&P=0&h=180" alt="mediConnectImage" srcset="" style={{ height: '100px', width: '200px', objectFit: 'contain' }} />
                <h1 >mediConnect</h1>
                <div className='dropdown'>
                    <select name='Login' onChange={handleChange}>
                        <option value="Login">👤 Sign in</option>
                        <option value="Patient">👨🏻‍💼 Patient Login</option>
                        <option value="Doctor" >👨‍⚕️ Doctor Login</option>
                        <option value="Hospital">🏥 Hospital Login</option>
                    </select>
                </div>
            </header>
            <MDBCarousel showIndicators showControls fade>
                <MDBCarouselItem itemId={1}>
                    <img src='https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' className='d-block w-100' alt='...' style={{ height: '470px', width: '400px', objectFit: 'cover' }} />
                    <MDBCarouselCaption>
                        <h5 style={{ color: 'black', }}>Friendly Hosptilising</h5>
                        <p style={{ color: 'black', }}>Doctors Friendly Interaction with Patients</p>
                    </MDBCarouselCaption>
                </MDBCarouselItem>

                <MDBCarouselItem itemId={2}>
                    <img src='https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' className='d-block w-100' alt='...' style={{ height: '470px', width: '400px', objectFit: 'cover' }} />
                    <MDBCarouselCaption>
                        <h5 style={{ color: 'black', }}>Patient Interaction</h5>
                        <p style={{ color: 'black', }}>Consulting Doctor via Online Mode</p>
                    </MDBCarouselCaption>
                </MDBCarouselItem>

                <MDBCarouselItem itemId={3}>
                    <img src='https://images.pexels.com/photos/7195117/pexels-photo-7195117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' className='d-block w-100' alt='...' style={{ height: '470px', width: '400px', objectFit: 'cover' }} />
                    <MDBCarouselCaption>
                        <h5 style={{ color: 'black', }}>Medicine Recommendation</h5>
                        <p style={{ color: 'black', }}>Doctors Suggest Medicines to Patients via Online Mode.</p>
                    </MDBCarouselCaption>
                </MDBCarouselItem>
            </MDBCarousel>
            <div className="hero-section text-center mb-5">
                <h2>Welcome to Your Health Hub</h2>
                <p>Connecting Patients, Doctors, and Hospitals for Better Care</p>
                <button className="btn btn-light btn-lg" onClick={toPatient}>Get Started</button>
            </div>

            {/* Cards Container */}
            {/* <div className="row justify-content-center mb-2">
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
            </div> */}

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
        </div >
    );
};

export default LandingPage;
