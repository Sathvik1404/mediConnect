import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import DProfile from '../dprofile/Dprofile';
import { FaUserMd, FaCalendarCheck, FaSignOutAlt, FaUsers, FaHospital } from 'react-icons/fa';
import axios from 'axios';

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
      const response = await axios.get('https://mediconnect-but5.onrender.com/api/hospitals');
      const hospitalsWithStatus = response.data.map(hospital => ({
        ...hospital,
        applicationStatus: hospital.doctors.includes(doctor?._id)
          ? 'Approved'
          : doctor?.pendingHospitals?.includes(hospital._id)
          ? 'Pending'
          : 'Not Applied'
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
      const response = await axios.post(
        `https://mediconnect-but5.onrender.com/api/hospitals/${hospitalId}/apply`,
        {
          doctorId: doctor._id,
          doctorName: doctor.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
        }
      );

      console.log(response.data);

      setDoctor((prev) => ({
        ...prev,
        pendingHospitals: [...(prev.pendingHospitals || []), hospitalId],
      }));
      setError(null);
    } catch (error) {
      console.error('Error applying to hospital:', error);
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    if (doctor?.patients?.length > 0) {
      try {
        const patientDetails = await Promise.all(
          doctor.patients.map(async (patientId) => {
            const response = await axios.get(
              `https://mediconnect-but5.onrender.com/api/patient/profile/${patientId}`
            );
            return response.data;
          })
        );
        setPatients(patientDetails);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('https://mediconnect-but5.onrender.com/api/appointment');
      setAppointments(response.data.filter(apt => apt.doctorId === doctor._id));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(`https://mediconnect-but5.onrender.com/api/appointment/${appointmentId}`, {
        status: newStatus,
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
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
      {/* Navbar and content code remain unchanged */}
    </div>
  );
};

export default Dashboard;