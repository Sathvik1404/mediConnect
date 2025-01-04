import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Tab, Tabs, Button } from 'react-bootstrap';
import './PatientDetails.css'; // Import the customized CSS

const PatientDetails = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/${patientId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPatient(data);
                } else {
                    console.error('Failed to fetch patient details');
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    const handleDownloadRecord = async () => {
        try {
            const response = await fetch(`https://mediconnect-but5.onrender.com/api/patient/profile/downloadrecord/${patientId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${patient.name}_medical_record.pdf`; // You can customize the file name here
                a.click();
            } else {
                alert('No medical record');
            }
        } catch (error) {
            console.error('Error downloading medical record:', error);
        }
    };

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="patient-details-container">
            <Row>
                <Col md={12}>
                    <div className="patient-details-content">
                        <h2 className="patient-name">{patient.name}</h2>
                        <Tabs defaultActiveKey="info" id="patient-details-tabs" className="mb-3">
                            <Tab eventKey="info" title="Patient Info">
                                <div className="tab-content">
                                    <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
                                    <p><strong>Mobile:</strong> {patient.mobile || 'N/A'}</p>
                                    <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                                    <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
                                </div>
                            </Tab>
                            <Tab eventKey="records" title="Medical Records">
                                <div className="tab-content">
                                    <p><strong>Records:</strong> {patient.record ? (
                                        <Button variant="outline-primary" onClick={handleDownloadRecord}>
                                            Download Medical Record
                                        </Button>
                                    ) : 'N/A'}</p>
                                </div>
                            </Tab>
                            <Tab eventKey="address" title="Address">
                                <div className="tab-content">
                                    <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                                </div>
                            </Tab>
                        </Tabs>
                        <Button variant="outline-primary" onClick={() => window.print()}>Print Details</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PatientDetails;
