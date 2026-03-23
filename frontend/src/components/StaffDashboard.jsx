import React, { useState, useEffect } from 'react';
// CHANGED: Import callNextPatient instead of updateQueueStatus
import { getDepartments, callNextPatient } from '../services/api';

function StaffDashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await getDepartments();
      // Safeguard: Ensure we are setting an array
      const validData = Array.isArray(response) ? response : (response?.data || []);
      setDepartments(validData);
      setLoading(false);
    } catch (error) {
      console.error('Staff Dashboard Load Error:', error);
      setDepartments([]);
      setLoading(false);
    }
  };

  const handleCallNext = async (deptId) => {
    setUpdating(true);
    try {
      // CHANGED: Use callNextPatient as exported by your api.js
      await callNextPatient(deptId); 
      await fetchStaffData(); // Refresh list to show updated queue count
    } catch (error) {
      console.error("Queue Update Error:", error);
      alert("Failed to update queue. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Staff Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👨‍⚕️ Staff Management Portal</h2>
        <button 
          className="btn btn-outline-primary btn-sm" 
          onClick={fetchStaffData}
          disabled={updating}
        >
          {updating ? 'Updating...' : '🔄 Refresh Queues'}
        </button>
      </div>

      <div className="row">
        {Array.isArray(departments) && departments.length > 0 ? (
          departments.map((dept) => (
            <div className="col-lg-4 col-md-6 mb-4" key={dept.id}>
              <div className="card shadow-sm h-100 border-left-info">
                <div className="card-body">
                  <h5 className="card-title text-primary">{dept.name}</h5>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Waiting Patients:</span>
                    <span className="badge bg-danger rounded-pill fs-6">
                      {dept.current_queue || 0}
                    </span>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleCallNext(dept.id)}
                      disabled={updating || (dept.current_queue || 0) === 0}
                    >
                      Call Next Patient
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      View Full Queue
                    </button>
                  </div>
                </div>
                <div className="card-footer bg-light small text-muted">
                  Avg. Processing: {dept.avg_wait_time || 15} mins
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-warning text-center shadow-sm">
              No departments found. Please check your backend connection.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;