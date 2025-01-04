import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, LogOut, Edit2, Save, X } from 'lucide-react';

const Pprofile = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    mobile: '',
    record: ''
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
        record: auth.user.record || '',
      });
      setLoading(false);
    } else {
      setError('Failed to load patient details');
      setLoading(false);
    }
  }, [auth.user]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const fileData = new FormData();
    fileData.append('record', selectedFile);

    try {
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/uploadrecord/${auth.user._id}`, {
        method: 'PUT',
        body: fileData,
      });

      if (response.ok) {
        const result = await response.json();
        setPatient(prev => ({ ...prev, record: result.filePath }));
        setFormData(prev => ({ ...prev, record: result.filePath }));
        alert('File uploaded successfully');
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/${auth.user._id}`);
      const patientData = await response.json();

      if (!selectedFile) {
        formData.record = patientData.record;
      }

      await fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/${auth.user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setPatient(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update details');
    }
  };

  const viewMedicalRecord = () => {
    window.open(`https://mediconnect-but5.onrender.com/api/patient/profile/downloadrecord/${auth.user._id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">mediConnect</span>
            </div>
            <button
              onClick={() => {
                auth.logout();
                navigate('/patient/login');
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-colors duration-200"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>

              {isEditing ? (
                <div className="space-y-6">
                  {Object.entries(formData).map(([key, value]) => (
                    key !== 'record' && (
                      <div key={key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {key}
                        </label>
                        <input
                          type={key === 'age' ? 'number' : 'text'}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    )
                  ))}

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Medical Record
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleFileUpload}
                      className="flex items-center px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Record
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(patient)
                    .filter(([key]) => key !== 'record' && key !== '_id' && key !== '__v' && key !== "doctors" && key !== 'password')
                    .map(([key, value]) => (
                      <div key={key} className="flex border-b border-gray-100 pb-4">
                        <span className="w-1/3 text-sm font-medium text-gray-500 capitalize">{key}:</span>
                        <span className="flex-1 text-sm text-gray-900">{value || 'N/A'}</span>
                      </div>
                    ))}

                  {patient.record && (
                    <div className="flex border-b border-gray-100 pb-4">
                      <span className="w-1/3 text-sm font-medium text-gray-500">Medical Record:</span>
                      <button
                        onClick={viewMedicalRecord}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        View Medical Record
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pprofile;