import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import DProfile from '../dprofile/Dprofile';
import { FaUserMd, FaCalendarCheck, FaSignOutAlt, FaUsers, FaHospital } from 'react-icons/fa';
import { ToggleButton } from 'react-bootstrap';

const Dashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toggleState, setToggleState] = useState(false);

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

  const handleLogout = () => {
    auth.logout();
    navigate('/doctor/dlogin');
  };

  const toggleButtonHandler = () => {
    setToggleState(!toggleState);
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
              <ToggleButton
                type="checkbox"
                variant="outline-primary"
                checked={toggleState}
                value="1"
                onChange={toggleButtonHandler}
              >
                {toggleState ? 'On' : 'Off'}
              </ToggleButton>
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

        {/* Conditional rendering for sections */}
        {selectedSection === 'Hospitals' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Hospital section content */}
          </div>
        )}

        {selectedSection === 'Patients' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Patients section content */}
          </div>
        )}

        {selectedSection === 'Appointments' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Appointments section content */}
          </div>
        )}

        {selectedSection === 'Profile' && (
          <DProfile
            doctor={doctor}
            onUpdateProfile={(updatedData) => setDoctor(updatedData)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
