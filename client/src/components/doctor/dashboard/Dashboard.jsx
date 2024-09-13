import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaUserMd, FaClipboardList, FaCalendarCheck, FaPrescriptionBottleAlt, FaUserEdit } from 'react-icons/fa';
import './Dashboard.css'; // Custom CSS file for additional styling
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [doctor, setDoctor] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedSection, setSelectedSection] = useState(''); // State to track the selected section
  const [patients, setPatients] = useState([]); // State to store fetched patient data
  const [updatedDoctor, setUpdatedDoctor] = useState({ specialization: [] }); // State for storing updated doctor details

  const navigate = useNavigate();
  const auth = useAuth();

  const specializationsList = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
  ];

  useEffect(() => {
    if (auth.user) {
      setDoctor(auth.user);
      setUpdatedDoctor({
        ...auth.user,
        specializations: auth.user.specialization || [],
      });
    }
  }, [auth.user]);

  const fetchPatients = async () => {
    if (doctor.patients && doctor.patients.length > 0) {
      try {
        const patientDetails = await Promise.all(
          doctor.patients.map(async (patientId) => {
            const response = await fetch(`http://localhost:5000/api/patient/profile/${patientId}`);
            if (response.ok) {
              return response.json(); // Assuming the API returns the patient data in JSON format
            } else {
              console.error(`Failed to fetch patient with ID ${patientId}`);
              return null;
            }
          })
        );
        setPatients(patientDetails.filter((patient) => patient !== null)); // Filter out null responses
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
  };

  const handleCardClick = (section) => {
    setSelectedSection(section);
    if (section === 'Patients') {
      fetchPatients(); // Fetch patients when the "Patients" card is clicked
    }
    else if (section === 'Appointments') {
      fetchAppointments();
    }
  };

  const handlePatientClick = (patient) => {
    const patientDetailsUrl = `/doctor/dashboard/patient/${patient._id}`;
    window.open(patientDetailsUrl, '_blank');
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/doctor/dlogin');
  };

  const handleInputChange = (e) => {
    setUpdatedDoctor({
      ...updatedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setUpdatedDoctor((prevState) => {
      if (prevState.specialization.includes(value)) {
        return {
          ...prevState,
          specialization: prevState.specialization.filter((spec) => spec !== value),
        };
      } else {
        return {
          ...prevState,
          specialization: [...prevState.specialization, value],
        };
      }
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/profile/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDoctor),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setDoctor(updatedData);
        // auth.setUser(updatedData); // Update user in AuthContext
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointment');
      if (response.ok) {
        const allAppointments = await response.json();
        // Assuming doctor._id is a string and appointments have a doctorId field
        const filteredAppointments = allAppointments.filter(appointment =>
          appointment.doctorId === doctor._id
        );
        setAppointments(filteredAppointments);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <Row className="dashboard-header">
        <Col>
          <h2>Welcome, Dr. {doctor.name}</h2>
        </Col>
      </Row>
      <Row className="dashboard-main">
        <Col md={2}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Patients')}>
            <Card.Body>
              <FaUserMd className="dashboard-icon" />
              <Card.Title>Patients</Card.Title>
              <Card.Text>Manage patient records and history</Card.Text>
              <Button variant="primary">View Patients</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Appointments')}>
            <Card.Body>
              <FaClipboardList className="dashboard-icon" />
              <Card.Title>Appointments</Card.Title>
              <Card.Text>View and manage your appointments</Card.Text>
              <Button variant="primary">View Appointments</Button>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={2}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Schedule')}>
            <Card.Body>
              <FaCalendarCheck className="dashboard-icon" />
              <Card.Title>Schedule</Card.Title>
              <Card.Text>Check your weekly schedule</Card.Text>
              <Button variant="primary">View Schedule</Button>
            </Card.Body>
          </Card>
        </Col> */}
        <Col md={2}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Prescriptions')}>
            <Card.Body>
              <FaPrescriptionBottleAlt className="dashboard-icon" />
              <Card.Title>Prescriptions</Card.Title>
              <Card.Text>Manage and view prescriptions</Card.Text>
              <Button variant="primary">View Prescriptions</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Profile')}>
            <Card.Body>
              <FaUserEdit className="dashboard-icon" />
              <Card.Title>Profile</Card.Title>
              <Card.Text>Update your profile details</Card.Text>
              <Button variant="primary">Update Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Display the selected section details */}
      <Row className="dashboard-details">
        <Col>
          {selectedSection === 'Patients' && (
            <div>
              <h3>Patients</h3>
              <ul>
                {patients.map((patient, index) => (
                  <li key={index} onClick={() => handlePatientClick(patient)} style={{ cursor: 'pointer' }}>
                    <p><strong>{patient.name}</strong></p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedSection === 'Appointments' && (
            <div>
              <h3>Appointments</h3>
              <ul>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <li key={index}>
                      <p><strong>Patient:</strong> {appointment.patientName}</p>
                      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(appointment.time).toLocaleTimeString()}</p>
                      <p><strong>Status:</strong> {appointment.status}</p>
                    </li>
                  ))
                ) : (
                  <p>No appointments available.</p>
                )}
              </ul>
            </div>
          )}

          {selectedSection === 'Schedule' && (
            <div>
              <h3>Schedule</h3>
              <p>Here you can check your weekly schedule.</p>
            </div>
          )}
          {selectedSection === 'Prescriptions' && (
            <div>
              <h3>Prescriptions</h3>
              <p>Here you can manage and view prescriptions.</p>
            </div>
          )}
          {selectedSection === 'Profile' && (
            <div>
              <h3>Update Profile</h3>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={updatedDoctor.name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={updatedDoctor.email || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group controlId="formSpecializations">
                  <Form.Label>Specializations</Form.Label>
                  <div>
                    {specializationsList.map((specialization, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={specialization}
                        value={specialization}
                        checked={updatedDoctor.specialization.includes(specialization)}
                        onChange={handleSpecializationChange}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
