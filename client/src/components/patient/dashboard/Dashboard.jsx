import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);

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
      const response = await fetch('http://localhost:5000/api/appointment');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();

      // Filter appointments to include only those belonging to the current patient
      const filteredAppointments = data.filter(appointment => appointment.patientId === auth.user._id);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h3 className="text-3xl font-bold text-indigo-600">mediConnect</h3>
            <button onClick={handleLogout} className="text-indigo-600">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="header mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to mediConnect Dashboard</h2>
            <button onClick={goProfile} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-200">
              View Profile
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Hospitals Section */}
          {selectedHospital ? (
            <div className="doctors-list mt-6">
              <h3 className="text-xl font-semibold">Doctors at {selectedHospital}</h3>
              <button onClick={() => { setDoctors([]); setSelectedHospital(null); }} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none transition duration-200">Back to Hospitals</button>
              {doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <div key={index} className="doctor-card bg-gray-100 p-4 rounded-lg shadow-md my-4 hover:bg-gray-200 transition duration-200">
                    <h4 className="text-lg font-bold">{doctor.name || 'Unknown Name'}</h4>
                    <p>Specialization: {doctor.specialization?.join(', ') || 'N/A'}</p>
                    <p>Experience: {doctor.experience || 'N/A'} years</p>
                    <button onClick={() => { navigate(`/patient/appointment/${doctor._id}`) }} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-200">Book Appointment</button>
                  </div>
                ))
              ) : (
                <p>No doctors available for this hospital.</p>
              )}
            </div>
          ) : (
            <div className="hospital-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {hospitals.length > 0 ? (
                hospitals.map((hospital, index) => (
                  <div key={index} onClick={() => fetchDoctors(hospital._id)} className="hospital-card cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                    <h3 className="text-xl font-bold">{hospital.name}</h3>
                    <p>Location: {hospital.location}</p>
                    <p>Rating: {hospital.rating} ⭐</p>
                  </div>
                ))
              ) : (
                <p>No hospitals found.</p>
              )}
            </div>
          )}

          {/* Active Appointments Section */}
          <div className="appointments-section mt-8">
            <h3 className="text-xl font-semibold">Active Appointments</h3>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div key={index} className="appointment-card bg-gray-100 p-4 rounded-lg shadow-md my-4">
                  <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  <button onClick={() => cancelAppointment(appointment._id)} className="mt-2 inline-flex items-center px-4 py-[8px] border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition duration=200">Cancel Appointment</button>
                </div>
              ))
            ) : (
              <p>No active appointments.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
