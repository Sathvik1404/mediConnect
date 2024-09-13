import React, { useEffect, useState } from 'react';
import './appointment.css';
import { useParams } from 'react-router-dom';

function App() {
    const [doctor, setDoctor] = useState('');
    const [user, setUser] = useState(null);
    const [date, setDate] = useState('');
    const [patientName, setPatientName] = useState('');
    const [email, setEmail] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const { doctorId } = useParams();
    const userId = localStorage.getItem('user');  // Assuming the user's ID is stored in localStorage

    // Fetch user details to prefill patient name and email
    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/patient/profile/${userId}`);
            const data = await response.json();
            setUser(data);
            setPatientName(data.name);   // Prefill patient name from user data
            setEmail(data.email);        // Prefill email from user data
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    // Fetch doctor details using doctorId from URL params
    const fetchDoctor = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/doctor/profile/${doctorId}`);
            const data = await response.json();
            if (response.ok) {
                setDoctor(data.name);  // Set doctor name from API
            } else {
                console.error('Error fetching doctor:', data.message);
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
        }
    };

    // UseEffect hook to fetch data on component mount
    useEffect(() => {
        fetchDoctor();
        fetchUser();
    }, []);

    // Handle appointment submission using FormData
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an object with the data to send
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
                    'Content-Type': 'application/json', // Ensure the content type is set
                },
                body: JSON.stringify(appointmentData), // Send the object as JSON
            });

            if (response.ok) {
                alert(`Appointment booked with Dr. ${doctor} on ${date} at ${appointmentTime} for ${patientName} (${email})`);

                // Reset the form fields
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


    return (
        <div className="App">
            <h2>Book Doctor Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Doctor: </label>
                    <input type="text" value={doctor} disabled />
                </div>
                <div>
                    <label>Appointment Date: </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Appointment Time: </label>
                    <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
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
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
}

export default App;
