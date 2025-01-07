import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import DProfile from '../dprofile/Dprofile';
import { FaUserMd, FaCalendarCheck, FaSignOutAlt, FaUsers, FaHospital } from 'react-icons/fa';

const Dashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isToggled, setIsToggled] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setDoctor(auth.user);
    }
  }, [auth.user]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://mediconnect-but5.onrender.com/api/hospitals');
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      const data = await response.json();

      const hospitalsWithStatus = data.map(hospital => ({
        ...hospital,
        applicationStatus: hospital.doctors.includes(doctor?._id) ? 'Approved' :
          doctor?.pendingHospitals?.includes(hospital._id) ? 'Pending' : 'Not Applied'
      }));

      setHospitals(hospitalsWithStatus);
      setError(null);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  const applyToHospital = async (hospitalId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/hospitals/${hospitalId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          doctorName: doctor.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.message || 'Failed to submit application');

      setDoctor((prev) => ({
        ...prev,
        pendingHospitals: [...(prev.pendingHospitals || []), hospitalId],
      }));
      setError(null);
    } catch (error) {
      console.error('Error applying to hospital:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    if (doctor?.patients?.length > 0) {
      try {
        const patientDetails = await Promise.all(
          doctor.patients.map(async (patientId) => {
            const response = await fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/${patientId}`);
            return response.ok ? response.json() : null;
          })
        );
        setPatients(patientDetails.filter(Boolean));
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://mediconnect-but5.onrender.com/api/appointment');
      if (response.ok) {
        const allAppointments = await response.json();
        setAppointments(allAppointments.filter(apt => apt.doctorId === doctor._id));
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/appointment/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments(prev =>
          prev.map(apt =>
            apt._id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/doctor/dlogin');
  };

  const menuItems = [
    {
      title: 'Hospitals',
      icon: <FaHospital className="w-6 h-6" />,
      onClick: () => {
        setSelectedSection('Hospitals');
        fetchHospitals();
      }
    },
    {
      title: 'Patients',
      icon: <FaUsers className="w-6 h-6" />,
      onClick: () => {
        setSelectedSection('Patients');
        fetchPatients();
      }
    },
    {
      title: 'Appointments',
      icon: <FaCalendarCheck className="w-6 h-6" />,
      onClick: () => {
        setSelectedSection('Appointments');
        fetchAppointments();
      }
    },
    {
      title: 'Profile',
      icon: <FaUserMd className="w-6 h-6" />,
      onClick: () => setSelectedSection('Profile')
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">mediConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Dr. {doctor?.name}</span>
              <div 
                onClick={() => setIsToggled(!isToggled)} 
                className={`relative w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isToggled ? 'bg-blue-500' : ''}`}
              >
                <div 
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${isToggled ? 'translate-x-6' : ''}`}
                ></div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <div
              key={item.title}
              onClick={item.onClick}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="text-blue-600">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Manage your {item.title.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedSection === 'Hospitals' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Hospitals</h2>
            {loading && <p className="text-gray-600">Loading hospitals...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-lg">{hospital.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{hospital.location}</p>
                  <p className="text-sm text-gray-600">Rating: {hospital.rating} ⭐</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(hospital.applicationStatus)}`}>                  {hospital.applicationStatus}
                    </span>
                    {hospital.applicationStatus === 'Not Applied' && (
                      <button
                        onClick={() => applyToHospital(hospital._id)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'Patients' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Patients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  onClick={() => window.open(`/doctor/dashboard/patient/${patient._id}`, '_blank')}
                  className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <FaUserMd className="w-8 h-8 text-gray-400" />
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-500">View Details</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'Appointments' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                    {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'Cancelled')}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'Profile' && (
          <DProfile doctor={doctor} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
