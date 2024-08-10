import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    mobile: '',
  });

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setPatient(auth.user);
      setFormData({
        name: auth.user.name || '',
        email: auth.user.email || '',
        age: auth.user.age || '',
        gender: auth.user.gender || '',
        address: auth.user.address || '',
        mobile: auth.user.mobile || '',
      });
      setLoading(false);
    } else {
      setError('Failed to load patient details');
      setLoading(false);
    }
  }, [auth.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      // Simulate an API call to update patient details
      // await new Promise((resolve) => setTimeout(resolve, 500));

      await fetch(`http://localhost:5000/api/patient/profile/${auth.user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Assume success and update the patient state
      setPatient({ ...patient, ...formData });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update details');
    }
  };

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
      {isEditing ? (
        <div>
          <div>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Age:</strong>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Gender:</strong>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
      ) : (
        <div>
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
        </div>
      )}
      <button onClick={handleEditToggle}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
};

export default Dashboard;
