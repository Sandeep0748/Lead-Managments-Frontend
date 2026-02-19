import React, { useState } from 'react';
import { leadAPI } from '../services/api';
import '../styles/EnrollForm.css';

const EnrollForm = () => {
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

  const courses = ['Web Development', 'Data Science', 'UI/UX Design', 'Mobile App Dev', 'Cloud Computing'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];

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
      setMessage({ type: 'error', text: 'All fields are required' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email' });
      return false;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number (10+ digits)' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setLoading(true);

    try {
      await leadAPI.submit(formData);
      setMessage({
        type: 'success',
        text: 'Successfully submitted! Our team will contact you soon.',
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
      const errorMsg = error.response?.data?.error || 'Failed to submit form';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-form-container">
      <div className="form-wrapper">
        <h1 className="form-title">Enroll Now</h1>
        <p className="form-subtitle">Join us and transform your career</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Select Course *</label>
            <select
              id="course"
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
            <label htmlFor="college">College/University *</label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter your college name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Current Year *</label>
            <select
              id="year"
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
          We respect your privacy. Your information will only be used to contact you about your enrollment.
        </p>
      </div>
    </div>
  );
};

export default EnrollForm;
