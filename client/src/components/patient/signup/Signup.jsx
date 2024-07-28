import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Signup.css'; // Import the custom CSS

const Signup = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Container fluid className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <motion.div
            className="signup-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h3>Patient Signup</h3>
            <Button onClick={toggleTheme} className="toggle-theme-btn">
              Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </Button>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formAge">
                <Form.Label className="form-label">Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter your age"
                  required
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formGender">
                <Form.Label className="form-label">Gender</Form.Label>
                <Form.Control as="select" required className="form-control">
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
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label className="form-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="form-control"
                />
              </Form.Group>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" className="button-custom">
                  Signup
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
