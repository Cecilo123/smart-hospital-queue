import React, { useState } from 'react';
import { checkTicketStatus } from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';

function CheckStatus() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    if (!ticketNumber.trim()) {
      setError('Please enter a ticket number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await checkTicketStatus(ticketNumber.toUpperCase());
      setTicketData(data);
    } catch (err) {
      setError('Ticket not found. Please check the number and try again.');
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">🔍 Check Ticket Status</h3>
            </div>

            <div className="card-body">
              {/* Search */}
              <div className="mb-4">
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter ticket number (e.g. GC-001)"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckStatus()}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckStatus}
                    disabled={loading}
                  >
                    {loading ? 'Checking...' : 'Check Status'}
                  </button>
                </div>

                {error && <div className="text-danger mt-2">{error}</div>}
              </div>

              {/* Ticket Info */}
              {ticketData && (
                <div className="card border-success">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h4 className="text-success">Ticket Details</h4>

                        <table className="table">
                          <tbody>
                            <tr>
                              <th>Ticket Number</th>
                              <td>
                                <span className="badge bg-primary fs-5">
                                  {ticketData.ticket.ticket_number}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <th>Patient</th>
                              <td>{ticketData.ticket.patient_name}</td>
                            </tr>
                            <tr>
                              <th>Department</th>
                              <td>{ticketData.ticket.department_name}</td>
                            </tr>
                            <tr>
                              <th>Position</th>
                              <td>
                                <strong>#{ticketData.ticket.position}</strong>
                              </td>
                            </tr>
                            <tr>
                              <th>Tickets Ahead</th>
                              <td>{ticketData.tickets_ahead}</td>
                            </tr>
                            <tr>
                              <th>Estimated Wait</th>
                              <td>{ticketData.estimated_wait_minutes} minutes</td>
                            </tr>
                            <tr>
                              <th>Status</th>
                              <td>
                                <span className="badge bg-info">
                                  {ticketData.ticket.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* QR Code */}
                      <div className="col-md-4 text-center">
                        <h5>QR Code</h5>
                        <QRCodeCanvas
                          value={ticketData.ticket.ticket_number}
                          size={150}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Help */}
              {!ticketData && !loading && (
                <div className="alert alert-info mt-4">
                  Enter your ticket number to see your queue status.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckStatus;
