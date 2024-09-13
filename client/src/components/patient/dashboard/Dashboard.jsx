import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]); // State for active appointments

  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate('/patient/login');
  };

  const goProfile = () => {
    navigate('/patient/profile');
  };

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/hospitals');
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      const data = await response.json();
      setHospitals(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Error fetching hospitals');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/hospitals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch hospital details');
      const data = await response.json();

      const doctorIds = data.doctors;
      const doctorsDetails = await Promise.all(
        doctorIds.map(async (doctorId) => {
          const doctorResponse = await fetch(`http://localhost:5000/api/doctor/profile/${doctorId}`);
          if (!doctorResponse.ok) throw new Error(`Failed to fetch doctor with id ${doctorId}`);
          return await doctorResponse.json();
        })
      );

      setDoctors(doctorsDetails);
      setSelectedHospital(data.name);
      setError(null);
    } catch (error) {
      console.error('Error fetching hospital details or doctors:', error);
      setError('Error fetching hospital details or doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/appointment'); // Adjust URL as needed
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      // Filter appointments to include only those belonging to the current patient
      const filteredAppointments = data.filter(appointment => appointment.patientId === auth.user._id); // Assuming auth.user.id holds the patient ID
      setAppointments(filteredAppointments);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/appointment/${appointmentId}`, {
        method: 'PUT', // Assuming you're using DELETE for cancellation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (!response.ok) throw new Error('Failed to cancel appointment');

      // Remove the cancelled appointment from the state
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      setError(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Error cancelling appointment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchAppointments();
  }, []);

  const goBackToHospitals = () => {
    setDoctors([]);
    setSelectedHospital(null);
  };

  const handleappointment = (doctorId) => {
    navigate(`/patient/appointment/${doctorId}`);
  };

  return (
    <div className="dashboard-conta">
      <div className="navba">
        <h3>mediConnect</h3>
        <div className="navbar-content">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="header">
          <h2>Welcome to mediConnect Dashboard</h2>
          <button onClick={goProfile} className="profile-btn">View Profile</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {selectedHospital ? (
          <div className="doctors-list">
            <h3>Doctors at {selectedHospital}</h3>
            <button onClick={goBackToHospitals} className="back-btn">Back to Hospitals</button>
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <div key={index} className="doctor-card" style={{ color: 'black' }}>
                  <h4>{doctor.name ? doctor.name : 'Unknown Name'}</h4>
                  <p>
                    Specialization : {doctor.specialization && doctor.specialization.length > 0 ? (
                      doctor.specialization.map((spec, idx) => (
                        <span key={idx}>
                          {spec}{idx < doctor.specialization.length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      'N/A'
                    )}
                  </p>
                  <p>Experience : {doctor.experience ? doctor.experience : 'N/A'} years</p>
                  <button className="btn btn-primary" onClick={() => handleappointment(doctor._id)}>
                    Book Appointment
                  </button>
                </div>
              ))
            ) : (
              <p>No doctors available for this hospital.</p>
            )}
          </div>
        ) : (
          <div className="hospital-grid">
            {hospitals.length > 0 ? (
              hospitals.map((hospital, index) => (
                <div key={index} className="hospital-card" onClick={() => fetchDoctors(hospital._id)}>
                  <h3>{hospital.name}</h3>
                  <p>Location: {hospital.location}</p>
                  <p>Rating: {hospital.rating} ⭐</p>
                </div>
              ))
            ) : (
              <p>Loading hospitals...</p>
            )}
          </div>
        )}

        {/* Active Appointments Section */}
        <div className="appointments-section">
          <h3>Active Appointments</h3>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment, index) => (
                <li key={index}>
                  <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  <button className="btn btn-danger" onClick={() => cancelAppointment(appointment._id)}>
                    Cancel Appointment
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
