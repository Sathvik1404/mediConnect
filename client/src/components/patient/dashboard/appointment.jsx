import React, { useEffect, useState } from 'react';
import './appointment.css';
import { useParams } from 'react-router-dom';

function App() {
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');
    const [patientName, setPatientName] = useState('');
    const [email, setEmail] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const { doctorId } = useParams();

    useEffect(() => {
        fetchDoctor();
    }, []);

    // Fetch doctor details using doctorId from URL params
    const fetchDoctor = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/doctor/profile/${doctorId}`);
            const data = await response.json();

            if (response.ok) {
                setDoctor(data.name); // Assuming 'name' is a key in the doctor profile data
            } else {
                console.error('Error fetching doctor:', data.message);
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // In a real application, you'd send the data to a backend here
        // Example: axios.post('/api/book-appointment', { doctor, date, patientName, email, appointmentTime });

        alert(`Appointment booked with Dr. ${doctor} on ${date} at ${appointmentTime} for ${patientName} (${email})`);

        // Reset the form
        setDoctor('');
        setDate('');
        setPatientName('');
        setEmail('');
        setAppointmentTime('');
    };

    return (
        <div className="App">
            <h2>Book Doctor Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Doctor: </label>
                    {/* Automatically populates the doctor name fetched from the API */}
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
