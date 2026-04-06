import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL + '/api';

const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);

// ─── createComplaint uses native fetch, NOT axios ────────────────────────────
// Reason: Axios 1.x interceptors corrupt the multipart/form-data boundary
// when headers are mutated, causing req.body to be empty on the server.
// fetch() lets the browser set Content-Type + boundary automatically.
export const createComplaint = (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return fetch(`${process.env.REACT_APP_API_URL}/api/complaints`, {
    method: 'POST',
    headers: {
      Authorization: user?.token ? `Bearer ${user.token}` : '',
      // NO Content-Type header — browser sets it with correct boundary
    },
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
        const error = new Error('API Error');
        error.response = { data };
        throw error;
    }
    return { data };
  });
};
// ─────────────────────────────────────────────────────────────────────────────

export const getComplaints      = ()        => API.get('/complaints');
export const getComplaintById   = (id)      => API.get(`/complaints/${id}`);
export const updateComplaint    = (id, data)=> API.put(`/complaints/${id}`, data);
export const deleteComplaint    = (id)      => API.delete(`/complaints/${id}`);

export const getAllComplaints      = (params)    => API.get('/admin/complaints', { params });
export const updateComplaintStatus = (id, data) => API.put(`/admin/update-status/${id}`, data);
export const getDashboardStats     = ()          => API.get('/admin/stats');

export const getAnalyticsOverview   = () => API.get('/analytics/overview');
export const getAnalyticsCategories = () => API.get('/analytics/categories');
export const getAnalyticsPriorities = () => API.get('/analytics/priorities');
export const getAnalyticsTrends     = () => API.get('/analytics/trends');
