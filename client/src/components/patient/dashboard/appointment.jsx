import React, { useEffect, useState } from 'react';
import './appointment.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

function App() {
    const [doctor, setDoctor] = useState('');
    const [user, setUser] = useState(null);
    const [date, setDate] = useState('');
    const [patientName, setPatientName] = useState('');
    const [email, setEmail] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [minTime, setMinTime] = useState('');

    const { doctorId } = useParams();
    const userId = localStorage.getItem('user');

    const navigate = useNavigate();
    const auth = useAuth();

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/patient/profile/${userId}`);
            const data = await response.json();
            setUser(data);
            setPatientName(data.name);
            setEmail(data.email);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchDoctor = async () => {
        try {
            console.log(doctorId)
            const response = await fetch(`http://localhost:5000/api/doctor/profile/${doctorId}`);
            const data = await response.json();
            if (response.ok) {
                setDoctor(data.name);
            } else {
                console.error('Error fetching doctor:', data.message);
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
        }
    };

    useEffect(() => {
        fetchDoctor();
        fetchUser();

        // Set the minimum date to today
        const today = new Date().toISOString().split('T')[0];
        setDate(today);

        // Set the minimum time for today's date to the current time
        const currentTime = new Date().toTimeString().slice(0, 5);
        setMinTime(currentTime);
    }, []);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);

        // If the selected date is today, set the minimum time to the current time
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate === today) {
            const currentTime = new Date().toTimeString().slice(0, 5);
            setMinTime(currentTime);
        } else {
            setMinTime('00:00');  // Reset to midnight for other dates
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const appointmentData = {
            doctorId: doctorId,
            patientId: userId,
            patientName: patientName,
            patientEmail: email,
            date: date,
            time: appointmentTime
        };

        try {
            const response = await fetch(`http://localhost:5000/api/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                window.location.href = 'https://rzp.io/rzp/5SJnOPV'
                // alert(`Appointment booked with Dr. ${doctor} on ${date} at ${appointmentTime} for ${patientName} (${email})`);
                setDoctor('');
                setDate('');
                setPatientName('');
                setEmail('');
                setAppointmentTime('');
            } else {
                const data = await response.json();
                console.error('Error booking appointment:', data.message);
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
                        min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                        required
                    />
                </div>
                <div>
                    <label>Appointment Time: </label>
                    <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        min={date === new Date().toISOString().split('T')[0] ? minTime : '00:00'} // Set minimum time for today
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
