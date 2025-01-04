import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const Dashboard = () => {
  const [state, setState] = useState({
    hospitals: [],
    doctors: [],
    selectedHospital: null,
    appointments: [],
    loading: false,
    error: null
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleError = useCallback((error, errorMessage) => {
    console.error(error);
    setState(prev => ({ ...prev, error: errorMessage, loading: false }));
  }, []);

  const fetchData = useCallback(async (url, errorMessage) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${errorMessage}`);
      return await response.json();
    } catch (error) {
      handleError(error, `Error fetching ${errorMessage}`);
      return null;
    }
  }, [handleError]);

  const fetchHospitals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    const data = await fetchData('https://mediconnect-but5.onrender.com/api/hospitals', 'hospitals');
    if (data) {
      setState(prev => ({
        ...prev,
        hospitals: data,
        loading: false,
        error: null
      }));
    }
  }, [fetchData]);

  const fetchDoctors = useCallback(async (hospitalId) => {
    setState(prev => ({ ...prev, loading: true }));

    const hospitalData = await fetchData(
      `https://mediconnect-but5.onrender.com/api/hospitals/${hospitalId}`,
      'hospital details'
    );

    if (!hospitalData) return;

    const doctorPromises = hospitalData.doctors.map(doctorId =>
      fetchData(`https://mediconnect-but5.onrender.com/api/doctor/profile/${doctorId}`, `doctor ${doctorId}`)
    );

    const doctorsDetails = await Promise.all(doctorPromises);
    const validDoctors = doctorsDetails.filter(Boolean);

    setState(prev => ({
      ...prev,
      doctors: validDoctors,
      selectedHospital: hospitalData.name,
      loading: false,
      error: null
    }));
  }, [fetchData]);

  const fetchAppointments = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    const data = await fetchData('https://mediconnect-but5.onrender.com/api/appointment', 'appointments');

    if (data) {
      const filteredAppointments = data.filter(appointment =>
        appointment.patientId === user._id
      );
      setState(prev => ({
        ...prev,
        appointments: filteredAppointments,
        loading: false,
        error: null
      }));
    }
  }, [fetchData, user._id]);

  const cancelAppointment = async (appointmentId) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(
        `https://mediconnect-but5.onrender.com/api/appointment/${appointmentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: "Cancelled" })
        }
      );

      if (!response.ok) throw new Error('Failed to cancel appointment');

      setState(prev => ({
        ...prev,
        appointments: prev.appointments.filter(apt => apt._id !== appointmentId),
        loading: false,
        error: null
      }));
    } catch (error) {
      handleError(error, 'Error cancelling appointment');
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchAppointments();
  }, [fetchHospitals, fetchAppointments]);

  const AppointmentCard = ({ appointment }) => {
    const isCancelled = appointment.status === "Cancelled";
    const statusStyles = isCancelled
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';

    return (
      <div className="bg-white rounded-lg shadow-md my-4 p-4">
        <div className="space-y-2">
          <p><strong>Doctor:</strong> {appointment.doctorName}</p>
          <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p>
            <strong>Status:</strong>
            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${statusStyles}`}>
              {appointment.status}
            </span>
          </p>
          <button
            onClick={() => cancelAppointment(appointment._id)}
            disabled={isCancelled}
            className={`
              mt-2 px-4 py-2 rounded-md text-white
              ${isCancelled
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-red-600 hover:bg-red-700 focus:outline-none'
              }
              transition duration-200
            `}
          >
            {isCancelled ? 'Cancelled' : 'Cancel Appointment'}
          </button>
        </div>
      </div>
    );
  };

  const DoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-lg shadow-md my-4 p-4 hover:shadow-lg transition duration-200">
      <h4 className="text-lg font-bold">{doctor.name || 'Unknown Name'}</h4>
      <p>Specialization: {doctor.specialization?.join(', ') || 'N/A'}</p>
      <p>Experience: {doctor.experience || 'N/A'} years</p>
      <button
        onClick={() => navigate(`/patient/appointment/${doctor._id}`)}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition duration-200"
      >
        Book Appointment
      </button>
    </div>
  );

  const HospitalCard = ({ hospital }) => (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition duration-200"
      onClick={() => fetchDoctors(hospital._id)}
    >
      <h3 className="text-xl font-bold">{hospital.name}</h3>
      <p>Location: {hospital.location}</p>
      <p>Rating: {hospital.rating} ⭐</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h3 className="text-3xl font-bold text-indigo-600">mediConnect</h3>
            <button
              onClick={() => { logout(); navigate('/patient/login'); }}
              className="text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to mediConnect Dashboard</h2>
            <button
              onClick={() => navigate('/patient/profile')}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition duration-200"
            >
              View Profile
            </button>
          </div>

          <div className="p-8">
            {state.loading && <p>Loading...</p>}
            {state.error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                {state.error}
              </div>
            )}

            {state.selectedHospital ? (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">
                  Doctors at {state.selectedHospital}
                </h3>
                <button
                  onClick={() => setState(prev => ({
                    ...prev,
                    doctors: [],
                    selectedHospital: null
                  }))}
                  className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none transition duration-200"
                >
                  Back to Hospitals
                </button>
                {state.doctors.length > 0 ? (
                  state.doctors.map((doctor, index) => (
                    <DoctorCard key={doctor._id || index} doctor={doctor} />
                  ))
                ) : (
                  <p>No doctors available for this hospital.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {state.hospitals.length > 0 ? (
                  state.hospitals.map((hospital, index) => (
                    <HospitalCard key={hospital._id || index} hospital={hospital} />
                  ))
                ) : (
                  <p>No hospitals found.</p>
                )}
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-xl font-semibold">Your Appointments</h3>
              {state.appointments.length > 0 ? (
                state.appointments.map((appointment, index) => (
                  <AppointmentCard
                    key={appointment._id || index}
                    appointment={appointment}
                  />
                ))
              ) : (
                <p className="text-gray-600 mt-4">No appointments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;