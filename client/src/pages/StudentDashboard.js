import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComplaints, deleteComplaint } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Trash2, Eye, Plus, FileText, Tag, LayoutDashboard, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await getComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try { 
        await deleteComplaint(id); 
        fetchComplaints(); 
      } catch (err) { console.error(err); }
    }
  };

  // Derived stats
  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved   = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 space-y-8">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary-500/20 text-white"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-white/80 font-medium mb-1 flex items-center gap-2">
                <span className="text-xl">👋</span> Welcome back,
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 font-display">
                {user?.name || 'Student'}
              </h1>
              <p className="text-primary-100 max-w-lg mt-2 font-medium">
                Track and manage your campus issues effortlessly via your personal intelligence hub.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/student/submit')} 
              className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-primary-600 hover:bg-slate-50 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Plus size={18} />
              New Complaint
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            icon={<LayoutDashboard />} 
            label="Total Complaints"   
            value={total}      
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" 
          />
          <DashboardCard 
            icon={<Clock />} 
            label="Pending"            
            value={pending}    
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)" 
          />
          <DashboardCard 
            icon={<AlertCircle />} 
            label="In Progress"        
            value={inProgress} 
            gradient="linear-gradient(135deg, #0ea5e9, #38bdf8)" 
          />
          <DashboardCard 
            icon={<CheckCircle2 />} 
            label="Resolved"           
            value={resolved}   
            gradient="linear-gradient(135deg, #10b981, #34d399)" 
          />
        </div>

        {/* Complaints Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-display">My Complaints</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Showing {total} tracked issues</p>
            </div>
            {total > 0 && (
              <button 
                onClick={() => navigate('/student/submit')} 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Plus size={16} /> Submit Another
              </button>
            )}
          </div>

          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-primary-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Loading records...</p>
              </div>
            ) : total === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No complaints filed yet</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                  You haven't reported any issues. When you do, they will appear here for tracking.
                </p>
                <button 
                  onClick={() => navigate('/student/submit')} 
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all"
                >
                  <Plus size={18} /> First Complaint
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {complaints.map((c, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={c._id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 align-middle">
                          <div className="font-semibold text-slate-800 text-sm">{c.title}</div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                            <Tag size={12} /> {c.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            c.priority === 'High' ? 'bg-red-50 text-red-600' :
                            c.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {c.priority === 'High' ? '🔴' : c.priority === 'Medium' ? '🟡' : '🟢'} {c.priority || 'Low'}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                            c.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle text-sm text-slate-500 font-medium">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/student/complaint/${c._id}`)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default StudentDashboard;
