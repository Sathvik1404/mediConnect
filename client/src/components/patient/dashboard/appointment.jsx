// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');
    const [patientName, setPatientName] = useState('');
    const [email, setEmail] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

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
                    <label>Select Doctor: </label>
                    <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                        <option value="" disabled>Select a Doctor</option>
                        <option value="Smith">Dr. Smith</option>
                        <option value="Johnson">Dr. Johnson</option>
                        <option value="Brown">Dr. Brown</option>
                        {/* Add more doctors here */}
                    </select>
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
