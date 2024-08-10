import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const PatientDetails = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            // console.log(patientId)
            try {
                const response = await fetch(`http://localhost:5000/api/patient/profile/${patientId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPatient(data);
                    // console.log(data)
                } else {
                    console.error('Failed to fetch patient details');
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="patient-details-container">
            <Row>
                <Col>
                    <h3>Patient Details</h3>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Mobile:</strong> {patient.mobile}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Records:</strong> {patient.record}</p>
                    <p><strong>Address:</strong> {patient.address}</p>
                    {/* <p><strong>Condition:</strong> {patient.condition}</p> */}
                    {/* Add more details as needed */}
                </Col>
            </Row>
        </Container>
    );
};

export default PatientDetails;
