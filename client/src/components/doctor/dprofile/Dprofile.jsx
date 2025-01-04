import React from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';

const specializationsList = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
];

const DProfile = ({ doctor, onUpdateProfile }) => {
  const [updatedDoctor, setUpdatedDoctor] = React.useState({
    ...doctor,
    specialization: doctor?.specialization || []
  });

  const handleInputChange = (e) => {
    setUpdatedDoctor({
      ...updatedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setUpdatedDoctor((prevState) => ({
      ...prevState,
      specialization: prevState.specialization.includes(value)
        ? prevState.specialization.filter((spec) => spec !== value)
        : [...prevState.specialization, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/doctor/profile/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDoctor),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdateProfile(updatedData);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={updatedDoctor.name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specializations
          </label>
          <div className="grid grid-cols-2 gap-4">
            {specializationsList.map((specialization) => (
              <div key={specialization} className="flex items-center">
                <input
                  type="checkbox"
                  value={specialization}
                  checked={updatedDoctor.specialization.includes(specialization)}
                  onChange={handleSpecializationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {specialization}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default DProfile;