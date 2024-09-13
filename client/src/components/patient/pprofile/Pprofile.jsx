import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pprofile.css'
import { FaArrowLeft } from 'react-icons/fa';

const Pprofile = () => {
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
    record: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

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
        record: auth.user.record || '',
      });
      setLoading(false);
    } else {
      setError('Failed to load patient details');
      setLoading(false);
    }
  }, [auth.user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const fileData = new FormData();
    fileData.append('record', selectedFile);

    try {
      const response = await fetch(`http://localhost:5000/api/patient/profile/uploadrecord/${auth.user._id}`, {
        method: 'PUT',
        body: fileData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('File uploaded successfully');
        // Update the state with the uploaded file details
        setPatient({ ...patient, record: result.filePath });
        setFormData({ ...formData, record: result.filePath });
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      // Fetch the latest patient details to get the current record path
      const response = await fetch(`http://localhost:5000/api/patient/profile/${auth.user._id}`);
      const patientData = await response.json();

      // Include the existing record path in the formData if no new file is uploaded
      if (!selectedFile) {
        formData.record = patientData.record;
      }

      await fetch(`http://localhost:5000/api/patient/profile/${auth.user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setPatient({ ...patient, ...formData });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update details');
    }
  };

  const viewMedicalRecord = () => {
    window.open(`http://localhost:5000/api/patient/profile/downloadrecord/${auth.user._id}`, '_blank');
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
    <div className="main">
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content ">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="contt">
        <div className="sidebar">
          <button type="button" onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Back
          </button>
          <div className="sidebar-cell" onClick={handleEditToggle}>
            {isEditing ? 'Cancel' : 'Edit'}
          </div>
        </div>
        <div className="content-area">
          <h2>Your Details</h2>
          {isEditing ? (
            <div className="cardd">
              <div>
                <label>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Upload Medical Record:</strong>
                  <input type="file" name='record' onChange={handleFileChange} />
                </label>
              </div>
              <button className="btn btn-success mt-3" onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button className="btn btn-primary mt-3" onClick={handleFileUpload}>
                Upload Medical Record
              </button>
            </div>
          ) : (
            <div className="cardd">
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
              {patient.record && (
                <div>
                  <strong>Medical Record:</strong>
                  <button className="btn btn-link" onClick={viewMedicalRecord}>
                    View Medical Record
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pprofile;
