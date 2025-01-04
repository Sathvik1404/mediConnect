import React, { useEffect, useState } from 'react';
import './appointment.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [doctor, setDoctor] = useState('');
    const [user, setUser] = useState(null);
    const [date, setDate] = useState('');
    const [patientName, setPatientName] = useState('');
    const [email, setEmail] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [minTime, setMinTime] = useState('');
    const { doctorId } = useParams();

    const navigate = useNavigate();
    const auth = useAuth();
    const userId = auth.user?._id;

    useEffect(() => {
        if (!userId) {
            navigate('/login'); // Redirect if user is not authenticated
            return;
        }

        const fetchData = async () => {
            try {
                const [userResponse, doctorResponse] = await Promise.all([
                    fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/${userId}`),
                    fetch(`https://mediconnect-but5.onrender.com/api/doctor/profile/${doctorId}`)
                ]);

                const userData = await userResponse.json();
                const doctorData = await doctorResponse.json();

                if (userResponse.ok) {
                    setUser(userData);
                    setPatientName(userData.name);
                    setEmail(userData.email);
                } else {
                    console.error('Error fetching user:', userData.message);
                }

                if (doctorResponse.ok) {
                    setDoctor(doctorData.name);
                } else {
                    console.error('Error fetching doctor:', doctorData.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const today = new Date().toISOString().split('T')[0];
        setDate(today);

        const currentTime = new Date().toTimeString().slice(0, 5);
        setMinTime(currentTime);
    }, [userId, doctorId, navigate]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);

        const today = new Date().toISOString().split('T')[0];
        setMinTime(selectedDate === today ? new Date().toTimeString().slice(0, 5) : '00:00');
    };




    const amount = 300; // Example amount in paise (₹50.00)
    const loadRazorpay = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => console.log('Razorpay SDK loaded successfully');
        script.onerror = () => console.error('Razorpay SDK failed to load');
        document.body.appendChild(script);
    };
    loadRazorpay();







    const handleSubmit = async (e) => {
        e.preventDefault();
        const [userResponse] = await Promise.all([
            fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/${userId}`)
        ]);

        const userData = await userResponse.json();
        const options = {
            key: 'rzp_test_BxN4zyfawxKOr3', // Replace with your Razorpay Key ID
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'mediConnect',
            image: 'https://s3.ap-south-1.amazonaws.com/rzp-prod-merchant-assets/payment-link/description/pdggkocyrqji6v.jpeg',
            description: 'Consultation Fee',
            handler: (response) => {
                // Handle successful payment
                console.log('Payment successful:', response);
                toast.success('Appointment Booked Successfully 👩🏻‍⚕️Payment ID: ' + response.razorpay_payment_id);
            },
            prefill: {
                name: userData.name,
                email: userData.email,
                contact: userData.mobile,
            },
            notes: {
                address: userData.address,
            },
            theme: {
                color: '#3399cc',
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        const appointmentData = {
            doctorId: doctorId,
            patientId: userId,
            patientName: patientName,
            patientEmail: email,
            date: date,
            time: appointmentTime,
            doctorName: doctor,
        };

        try {
            const response = await fetch('https://mediconnect-but5.onrender.com/api/appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                // Reset state
                setDoctor('');
                setDate('');
                setPatientName('');
                setEmail('');
                setAppointmentTime('');
            } else {
                const data = await response.json();
                console.error('Error booking appointment:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleLogout = () => {
        auth.logout();
        navigate('/doctor/dlogin');
    };

    return (
        <div className="App">
            <ToastContainer />
            <div className="navbar">
                <h3>mediConnect</h3>
                <div className="navbar-content">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <h2>Book Doctor Appointment</h2>
                <div>
                    <label>Doctor: </label>
                    <input type="text" value={doctor} disabled />
                </div>
                <div>
                    <label>Appointment Date: </label>
                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>
                <div>
                    <label>Appointment Time: </label>
                    <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        min={date === new Date().toISOString().split('T')[0] ? minTime : '00:00'}
                        required
                    />
                </div>
                <div>
                    <label>Patient's Name: </label>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Patient's Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="actions">
                    <button type="button" onClick={() => navigate(-1)}>Go Back</button>
                    <button type="submit">Book Appointment</button>
                </div>
            </form>
        </div>
    );
}

export default App;
