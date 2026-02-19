import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    course: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const courses = ['Web Development', 'Data Science', 'UI/UX Design', 'Mobile App Dev', 'Cloud Computing'];

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await leadAPI.getAll({
        page,
        limit: pagination.limit,
        ...filters,
      });
      setLeads(response.data.data || []);
      setPagination(response.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to fetch leads';
      setError(errorMsg);
      showMessage(errorMsg, 'error');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, [filters]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await leadAPI.updateStatus(leadId, newStatus);
      showMessage('Lead status updated successfully', 'success');
      fetchLeads(pagination.page || 1);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update status';
      showMessage(errorMsg, 'error');
    }
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(leadId);
        showMessage('Lead deleted successfully', 'success');
        fetchLeads(pagination.page || 1);
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to delete lead';
        showMessage(errorMsg, 'error');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Lead Management Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="leads-table-wrapper">
        {loading ? (
          <p>Loading leads...</p>
        ) : leads.length === 0 ? (
          <p>No leads found</p>
        ) : (
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>College</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.course}</td>
                  <td>{lead.college}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchLeads(Math.max(1, pagination.page - 1))}
          >
            Previous
          </button>
          <span>
            Page {pagination.page || 1} of {pagination.pages || 1}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchLeads(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
