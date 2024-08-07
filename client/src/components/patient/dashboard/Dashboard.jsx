import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setPatient(auth.user);
      setLoading(false);
    } else {
      setError('Failed to load patient details');
      setLoading(false);
    }
  }, [auth.user]);

  const handleLogout = () => {
    auth.logout();
    navigate('/patient/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <h1>Dashboard</h1>
      <h2>Your Details</h2>
      <div>
        <strong>Name:</strong> {patient.name || 'N/A'}
      </div>
      <div>
        <strong>Email:</strong> {patient.email || 'N/A'}
      </div>
      <div>
        <strong>Age:</strong> {patient.age || 'N/A'}
      </div>
      <div>
        <strong>Gender:</strong> {patient.gender || 'N/A'}
      </div>
      <div>
        <strong>Address:</strong> {patient.address || 'N/A'}
      </div>
      <div>
        <strong>Phone:</strong> {patient.mobile || 'N/A'}
      </div>
      {/* Add more patient details as necessary */}
    </div>
  );
};

export default Dashboard;
