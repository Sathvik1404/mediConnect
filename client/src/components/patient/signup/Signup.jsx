import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        className: 'custom-toast',
      });
      return;
    }

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
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          className: 'custom-toast',
        });

        setFormData({
          name: '',
          age: '',
          gender: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.error || '⚠️ Signup failed. Please try again.', {
          position: 'top-center',
          className: 'custom-toast',
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-center',
        className: 'custom-toast',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={`signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Button onClick={toggleTheme} className="toggle-button" >
            {isDarkMode ? '☀' : '🌙'}
          </Button>
          <motion.div
            className="signup-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="signup-header">
              Patient Signup
            </div>

            <div className="signup-body">
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
                  <Button type="submit" className="button-custom mt-3">
                    Signup
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
    </Container>
  );
};

export default Signup;
