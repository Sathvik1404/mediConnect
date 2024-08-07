import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patient/doctorslist');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data); // Assuming the API returns an array of doctors
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    auth.logout();
    navigate('/patient/login');
  }

  return (
    <div>
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content ">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <h1>Dashboard</h1>
      <h2>Doctors List</h2>
      {doctors.length === 0 ? (
        <div>No doctors available.</div>
      ) : (
        <ul>
          {doctors.map((doctor, index) => (
            <li key={index}>
              <strong>{doctor.name}</strong>
              <ul>
                {doctor.specialization.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
