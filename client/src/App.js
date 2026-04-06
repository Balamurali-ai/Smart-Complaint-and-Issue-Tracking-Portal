import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminDashboard from './pages/AdminDashboard';
import ManageComplaints from './pages/ManageComplaints';
import Insights from './pages/Insights';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page is the default route */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route path="/student/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/submit"    element={<PrivateRoute role="student"><SubmitComplaint /></PrivateRoute>} />
        <Route path="/student/complaint/:id" element={<PrivateRoute role="student"><ComplaintDetail /></PrivateRoute>} />
        <Route path="/student/insights"  element={<PrivateRoute role="student"><Insights /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard"  element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/complaints" element={<PrivateRoute role="admin"><ManageComplaints /></PrivateRoute>} />
        <Route path="/admin/insights"   element={<PrivateRoute role="admin"><Insights /></PrivateRoute>} />

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
