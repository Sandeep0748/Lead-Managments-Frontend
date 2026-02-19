import React, { useState, useEffect, useContext, useCallback } from 'react';
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
  const [message, setMessage] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const courses = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Mobile App Dev',
    'Cloud Computing',
  ];

  // ✅ Wrapped in useCallback (Fix for Vercel ESLint error)
  const fetchLeads = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await leadAPI.getAll({
          page,
          limit: pagination.limit,
          ...filters,
        });

        setLeads(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        setMessage('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // ✅ Updated dependency
  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await leadAPI.updateStatus(leadId, newStatus);
      setMessage('Lead status updated successfully');
      fetchLeads(pagination.page);
    } catch (error) {
      setMessage('Failed to update status');
    }
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(leadId);
        setMessage('Lead deleted successfully');
        fetchLeads(pagination.page);
      } catch (error) {
        setMessage('Failed to delete lead');
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

      {message && (
        <div className="message-box">
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={filters.course}
          onChange={(e) =>
            setFilters({ ...filters, course: e.target.value })
          }
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
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value)
                      }
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

      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => fetchLeads(pagination.page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.page} of {pagination.pages}
        </span>

        <button
          disabled={pagination.page === pagination.pages}
          onClick={() => fetchLeads(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
