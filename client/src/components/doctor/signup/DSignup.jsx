import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DSingup.css';

const DoctorSignup = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    specialization: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/doctor/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          className: 'hospital-toast',
          transition: Slide,
        });

        setFormData({
          name: '',
          age: '',
          gender: '',
          mobile: '',
          email: '',
          password: '',
          specialization: '',
        });
      } else {
        toast.error(data.error || '⚠ Signup failed. Please try again.', {
          position: 'top-center',
          className: 'hospital-toast',
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-center',
        className: 'hospital-toast',
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Button onClick={toggleTheme} className="toggle-button">
            {isDarkMode ? '☀' : '🌙'}
          </Button>
          <motion.div
            className="signup-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="signup-header text-Dark">Doctor Signup</div>

            <div className="signup-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label className="form-label">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control confit"
                  />
                </Form.Group>

                <Form.Group controlId="formAge">
                  <Form.Label className="form-label">Age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter your age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="form-control confit"
                  />
                </Form.Group>

                <Form.Group controlId="formGender">
                  <Form.Label className="form-label">Gender</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="form-control confit"
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
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="form-control confit"
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label className="form-label ">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control confit"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-control confit"
                  />
                </Form.Group>

                <Form.Group controlId="formSpecialization">
                  <Form.Label className="form-label">Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="form-control confit"
                  />
                </Form.Group>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="submit" className="button-custom mt-3" disabled={loading}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      'Signup'
                    )}
                  </Button>
                </motion.div>

                <div className="notification mt-3">
                  Please ensure all information is correct before submitting.
                </div>
              </Form>
            </div>
          </motion.div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default DoctorSignup;