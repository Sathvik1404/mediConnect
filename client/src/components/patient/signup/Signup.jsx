import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css'; // Import the custom CSS

const Signup = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/patient/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Signup successful!');
        setFormData({
          name: '',
          age: '',
          gender: '',
          mobile: '',
          email: '',
          password: '',
        });
      } else if (response.status === 400 && data.error === 'User already exists with this email') {
        toast.error('User already exists with this email. Please try another email.');
      } else {
        toast.error(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ToastContainer position="top-center" autoClose={3000} />
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <motion.div
            className="signup-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h3>Patient Signup</h3>
            <Button onClick={toggleTheme} className="toggle-button">
              {isDarkMode ? '☀' : '🌙'}
            </Button>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formAge">
                <Form.Label className="form-label">Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter your age"
                  required
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formGender">
                <Form.Label className="form-label">Gender</Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formMobile">
                <Form.Label className="form-label">Mobile</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your mobile number"
                  required
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label className="form-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" className="button-custom" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Signup'}
                </Button>
              </motion.div>

              <div className="notification">
                Please ensure all information is correct before submitting.
              </div>
            </Form>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
