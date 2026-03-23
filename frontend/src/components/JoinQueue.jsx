import React, { useState, useEffect } from 'react';
import { getDepartments, joinQueue } from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';

function JoinQueue() {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    patient_name: '',
    phone_number: '',
  });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DEPARTMENTS
  ========================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      // FIX: Ensure departments is always an array even if API returns { data: [...] }
      const validData = Array.isArray(response) ? response : (response?.data || []);
      setDepartments(validData);
    } catch (error) {
      console.error('Failed to load departments:', error);
      setDepartments([]); 
    }
  };

  /* =========================
     FORM HANDLERS
  ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.department) {
      alert('Please select a department');
      return;
    }
    if (step === 2 && (!formData.patient_name || !formData.phone_number)) {
      alert('Please fill all fields');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await joinQueue({
        ...formData,
        department: Number(formData.department),
      });
      setTicket(result);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert('Error creating ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 1 – SELECT DEPARTMENT
  ========================= */
  const renderStep1 = () => (
    <div className="card border-primary">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Step 1: Select Department</h4>
      </div>
      <div className="card-body">
        <div className="row">
          {/* FIX: Check if departments is an array before mapping */}
          {Array.isArray(departments) && departments.length > 0 ? (
            departments.map((dept) => (
              <div className="col-md-6 mb-3" key={dept.id}>
                <div
                  className={`card h-100 ${
                    Number(formData.department) === dept.id
                      ? 'border-success bg-light'
                      : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      department: dept.id,
                    }))
                  }
                >
                  <div className="card-body">
                    <h5>{dept.name}</h5>
                    <p className="mb-1">
                      <strong>Queue:</strong> {dept.current_queue || 0}
                    </p>
                    <p className="mb-0">
                      <strong>Avg Wait:</strong> {dept.avg_wait_time || 15} mins
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4">
              <p className="text-muted">Loading departments or no data available...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* =========================
     STEP 2 – PATIENT DETAILS
  ========================= */
  const renderStep2 = () => (
    <div className="card border-primary">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Step 2: Enter Details</h4>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="patient_name"
            placeholder="John Doe"
            value={formData.patient_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phone_number"
            placeholder="07..."
            value={formData.phone_number}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );

  /* =========================
     STEP 3 – CONFIRMATION
  ========================= */
  const renderStep3 = () => {
    // FIX: Use Optional Chaining (?.) to prevent error if department is not found
    const selectedDept = Array.isArray(departments) 
      ? departments.find((d) => d.id === Number(formData.department))
      : null;

    return (
      <div className="card border-primary">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Step 3: Confirm Details</h4>
        </div>
        <div className="card-body">
          <p><strong>Department:</strong> {selectedDept?.name || 'Not Selected'}</p>
          <p><strong>Name:</strong> {formData.patient_name}</p>
          <p><strong>Phone:</strong> {formData.phone_number}</p>

          <div className="alert alert-info mt-3">
            <p className="mb-1">
              <strong>Queue Position:</strong>{' '}
              {selectedDept ? (selectedDept.current_queue || 0) + 1 : 'N/A'}
            </p>
            <p className="mb-0">
              <strong>Estimated Wait:</strong>{' '}
              {selectedDept
                ? (selectedDept.avg_wait_time || 15) * ((selectedDept.current_queue || 0) + 1)
                : 'N/A'}{' '}
              mins
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* =========================
     STEP 4 – TICKET DISPLAY
  ========================= */
  const renderStep4 = () => (
    <div className="card border-success text-center shadow">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">Registration Successful!</h4>
      </div>
      <div className="card-body py-4">
        {ticket && ticket.ticket ? (
          <>
            <p className="text-muted mb-1">YOUR TICKET NUMBER</p>
            <h1 className="display-2 font-weight-bold text-success mb-3">
              {ticket.ticket.ticket_number}
            </h1>
            
            <div className="d-flex justify-content-center my-4">
               <QRCodeCanvas 
                value={String(ticket.ticket.ticket_number)}
                size={180}
                fgColor="#198754"
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="mb-4">
              <h5 className="mb-1">{ticket.ticket.patient_name}</h5>
              <p className="text-uppercase small text-muted">{ticket.ticket.department_name}</p>
            </div>

            <div className="row bg-light rounded p-3 mb-3 mx-2">
              <div className="col-6 border-right">
                <small className="text-muted d-block">POSITION</small>
                <strong>#{ticket.ticket.position}</strong>
              </div>
              <div className="col-6">
                <small className="text-muted d-block">EST. WAIT</small>
                <strong>{ticket.estimated_wait || '15'} mins</strong>
              </div>
            </div>

            <button
              className="btn btn-outline-dark btn-sm mt-3"
              onClick={() => window.print()}
            >
              🖨️ Print Ticket
            </button>
          </>
        ) : (
          <p>Error retrieving ticket details.</p>
        )}
      </div>
    </div>
  );

  /* =========================
     MAIN RENDER
  ========================= */
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Smart Queue Registration</h2>
          
          {/* Progress Indicator */}
          {step < 4 && (
            <div className="progress mb-4" style={{ height: '5px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="d-flex justify-content-between mt-4">
            {step > 1 && step < 4 && (
              <button className="btn btn-outline-secondary" onClick={handleBack}>
                Back
              </button>
            )}

            {step < 3 && (
              <button className="btn btn-primary px-4 ms-auto" onClick={handleNext}>
                Next
              </button>
            )}

            {step === 3 && (
              <button
                className="btn btn-success px-4 ms-auto"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Get My Ticket'}
              </button>
            )}

            {step === 4 && (
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  setStep(1);
                  setTicket(null);
                  setFormData({
                    department: '',
                    patient_name: '',
                    phone_number: '',
                  });
                }}
              >
                Register Another Patient
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinQueue;