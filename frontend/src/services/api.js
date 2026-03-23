import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// API calls
export const getDepartments = () => api.get('/departments');
export const joinQueue = (data) => api.post('/queue/join', data);
export const checkTicketStatus = (ticketId) =>
  api.get(`/queue/status/${ticketId}`);
export const callNextPatient = (departmentId) =>
  api.post(`/queue/next/${departmentId}`);

export default api;
