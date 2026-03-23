import React, { useState, useEffect } from 'react';
import { getDepartments } from '../services/api';

function Dashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      
      // FIX: Ensure 'departments' is always an array
      // If response is the array, use it. If it's wrapped in an object (e.g., response.data), use that.
      const validData = Array.isArray(response) ? response : (response?.data || []);
      
      setDepartments(validData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading departments:', error);
      setDepartments([]); // Fallback to empty array on error
      setLoading(false);
    }
  };

  const stats = [
    { label: "Patients Today", value: "127", icon: "👥", color: "primary" },
    { label: "Avg Wait Time", value: "12 min", icon: "⏱️", color: "secondary" },
    { label: "Departments", value: "6", icon: "🏥", color: "success" },
    { label: "Satisfaction", value: "94%", icon: "⭐", color: "warning" },
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Grid */}
      <div className="stats-grid mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Departments Queue Status */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0">📋 Department Queue Status</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Queue</th>
                  <th>Wait Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* SAFE RENDER: Check if departments is an array and has items */}
                {Array.isArray(departments) && departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept.id || dept._id}>
                      <td><strong>{dept.name}</strong></td>
                      <td>
                        <span className="badge badge-primary">
                          {dept.current_queue || 0} patients
                        </span>
                      </td>
                      <td>{dept.avg_wait_time || 15} mins</td>
                      <td>
                        <span className={`badge ${(dept.current_queue || 0) > 10 ? 'badge-warning' : 'badge-success'}`}>
                          {(dept.current_queue || 0) > 10 ? 'Busy' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No department data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;