import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      if (!token || !user) {
        setError('Invalid response from server');
        return;
      }
      
      login(user, token);
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button 
              type="button" 
              className="close-error" 
              onClick={() => setError('')}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
