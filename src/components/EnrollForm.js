import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadAPI } from '../services/api';
import '../styles/EnrollForm.css';

const EnrollForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
    year: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const courses = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Mobile App Dev',
    'Cloud Computing'
  ];

  const years = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Graduated'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone, course, college, year } = formData;

    if (!name || !email || !phone || !course || !college || !year) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return false;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number (minimum 10 digits).' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setLoading(true);

    // Prevent duplicate email (frontend level)
    const existingEmail = localStorage.getItem(`lead_${formData.email}`);
    if (existingEmail) {
      setMessage({
        type: 'error',
        text: 'This email has already been submitted.'
      });
      setLoading(false);
      return;
    }

    try {
      await leadAPI.submit(formData);

      localStorage.setItem(`lead_${formData.email}`, 'submitted');

      setMessage({
        type: 'success',
        text: 'Successfully submitted! Our team will contact you soon.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        year: '',
      });

    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        'Failed to submit form. Please try again later.';

      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-form-container" style={{ position: 'relative' }}>

      {/* Admin Login Button */}
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Admin Login
      </button>

      <div className="form-wrapper">
        <h1 className="form-title">Enroll Now</h1>
        <p className="form-subtitle">
          Join us and transform your career
        </p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Course *</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>College/University *</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter your college name"
              required
            />
          </div>

          <div className="form-group">
            <label>Current Year *</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">-- Select your year --</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <p className="form-note">
          We respect your privacy. Your information will only be used
          to contact you about your enrollment.
        </p>
      </div>
    </div>
  );
};

export default EnrollForm;