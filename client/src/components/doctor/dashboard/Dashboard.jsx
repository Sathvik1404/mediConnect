import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserMd, FaClipboardList, FaCalendarCheck, FaPrescriptionBottleAlt } from 'react-icons/fa';
import './Dashboard.css'; // Custom CSS file for additional styling
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [doctor, setDoctor] = useState('');
  const [selectedSection, setSelectedSection] = useState(''); // State to track the selected section
  const [patients, setPatients] = useState([]); // State to store fetched patient data

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setDoctor(auth.user);
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
  };

  const handlePatientClick = (patient) => {
    const patientDetailsUrl = `/doctor/dashboard/patient/${patient._id}`;
    window.open(patientDetailsUrl, '_blank');
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/doctor/dlogin');
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
        <Col md={3}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Patients')}>
            <Card.Body>
              <FaUserMd className="dashboard-icon" />
              <Card.Title>Patients</Card.Title>
              <Card.Text>Manage patient records and history</Card.Text>
              <Button variant="primary">View Patients</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Appointments')}>
            <Card.Body>
              <FaClipboardList className="dashboard-icon" />
              <Card.Title>Appointments</Card.Title>
              <Card.Text>View and manage your appointments</Card.Text>
              <Button variant="primary">View Appointments</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Schedule')}>
            <Card.Body>
              <FaCalendarCheck className="dashboard-icon" />
              <Card.Title>Schedule</Card.Title>
              <Card.Text>Check your weekly schedule</Card.Text>
              <Button variant="primary">View Schedule</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card" onClick={() => handleCardClick('Prescriptions')}>
            <Card.Body>
              <FaPrescriptionBottleAlt className="dashboard-icon" />
              <Card.Title>Prescriptions</Card.Title>
              <Card.Text>Manage and view prescriptions</Card.Text>
              <Button variant="primary">View Prescriptions</Button>
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
              <p>Here you can view and manage your appointments.</p>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
