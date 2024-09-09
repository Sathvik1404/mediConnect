import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();
  const auth = useAuth();

  // Function to handle logout
  const handleLogout = () => {
    auth.logout();
    navigate('/patient/login');
  };

  // Function to navigate to the Profile page
  const goProfile = () => {
    navigate('/patient/profile');
  };

  // Function to fetch hospitals from the API
  const fetchHospitals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hospitals');
      const data = await response.json();
      // console.log(data)
      setHospitals(data);  // Set the hospitals data in state
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  // useEffect to fetch hospitals when the component loads
  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="navbar">
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

        <div className="hospital-grid">
          {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <div key={index} className="hospital-card">
                <h3>{hospital.name}</h3>
                <p>Location: {hospital.location}</p>
                <p>Rating: {hospital.rating} ⭐</p>
              </div>
            ))
          ) : (
            <p>Loading hospitals...</p>  // Show a loading message while data is being fetched
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
