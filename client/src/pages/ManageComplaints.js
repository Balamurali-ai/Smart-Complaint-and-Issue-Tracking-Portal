import { useState, useEffect } from 'react';
import { getAllComplaints, updateComplaintStatus } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Bot, MessageSquare, Save, X, Edit, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';

/* ── helpers ─────────────────────────────────────────── */
const priorityStyle = (p) => {
  if (p === 'High') return 'bg-red-50 text-red-600 border-red-100';
  if (p === 'Medium') return 'bg-orange-50 text-orange-600 border-orange-100';
  return 'bg-emerald-50 text-emerald-600 border-emerald-100';
};

const statusStyle = (s) => {
  if (s === 'Resolved') return 'bg-emerald-100 text-emerald-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};

const ManageComplaints = () => {
  const [complaints, setComplaints]         = useState([]);
  const [filter, setFilter]                 = useState({ category: '', status: '', priority: '' });
  const [selectedComplaint, setSelected]    = useState(null);
  const [updateData, setUpdateData]         = useState({ status: '', assignedDepartment: '', resolutionMessage: '' });
  const [loading, setLoading]               = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchComplaints(); }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await getAllComplaints(filter);
      setComplaints(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    try {
      await updateComplaintStatus(selectedComplaint._id, updateData);
      setSelected(null);
      fetchComplaints();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Main ── */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display mb-1">Manage Complaints</h1>
          <p className="text-slate-500 font-medium">Review, filter, and resolve student issues.</p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-500 font-semibold px-2 hidden sm:flex">
              <SlidersHorizontal size={18} />
              Filters
            </div>
            {[
              { key: 'category', options: [['', 'All Categories'], ['Hostel', 'Hostel'], ['Academic', 'Academic'], ['Infrastructure', 'Infrastructure'], ['Other', 'Other']] },
              { key: 'status',   options: [['', 'All Status'], ['Pending', 'Pending'], ['In Progress', 'In Progress'], ['Resolved', 'Resolved']] },
              { key: 'priority', options: [['', 'All Priorities'], ['High', 'High'], ['Medium', 'Medium'], ['Low', 'Low']] },
            ].map(({ key, options }) => (
              <div key={key} className="relative w-full sm:w-auto flex-1 sm:flex-none">
                <select
                  value={filter[key]}
                  onChange={(e) => setFilter({ ...filter, [key]: e.target.value })}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                >
                  {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <Filter size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-auto flex justify-end">
            <div className="bg-primary-50 text-primary-600 px-4 py-2 rounded-xl text-sm font-bold shadow-inner">
              {complaints.length} Result{complaints.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Table Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 mt-4 font-medium animate-pulse">Loading records...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
              <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-full mb-6">
                <Search size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">No complaints found</h3>
              <p className="text-slate-500 max-w-sm">Try adjusting your filters or clearing them to see all records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    {['Student', 'Title', 'Category', 'AI Priority', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={c._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                            {c.userId?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{c.userId?.name}</div>
                            <div className="text-xs text-slate-500">{c.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="font-semibold text-slate-800 text-sm max-w-[200px] truncate">
                          {c.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${priorityStyle(c.priority)}`}>
                          {c.priority === 'High' ? '🔴' : c.priority === 'Medium' ? '🟡' : '🟢'} {c.priority || 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-slate-500 font-medium whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <button
                          onClick={() => { 
                            setSelected(c); 
                            setUpdateData({ status: c.status, assignedDepartment: c.assignedDepartment || '', resolutionMessage: c.resolutionMessage || '' }); 
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 rounded-xl font-bold text-xs transition-colors"
                        >
                          <Edit size={14} /> Update
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Update Modal ── */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center gap-2">
                  <Edit className="text-primary-500" /> Update Complaint
                </h3>
                <button 
                  onClick={() => setSelected(null)} 
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Overview</div>
                  <div className="font-bold text-slate-800">{selectedComplaint.title}</div>
                </div>

                {/* Images */}
                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <ImageIcon size={16} /> Attached Evidence
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedComplaint.images.map((src, i) => (
                        <a key={i} href={`${process.env.REACT_APP_API_URL}${src}`} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-xl border border-slate-200 aspect-video">
                          <img src={`${process.env.REACT_APP_API_URL}${src}`} alt={`img-${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="text-white" size={24} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Panel */}
                {selectedComplaint.aiGenerated && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Bot size={20} /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 text-sm">AI Priority Analysis</h4>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${priorityStyle(selectedComplaint.priority)}`}>
                        {selectedComplaint.priority}
                      </span>
                    </div>
                    <p className="text-indigo-800/80 text-sm font-medium leading-relaxed mb-4 relative z-10">
                      {selectedComplaint.priorityReason}
                    </p>
                    
                    {selectedComplaint.aiDetails && (
                      <div className="flex flex-wrap gap-2 relative z-10">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${selectedComplaint.aiDetails.keywordLayer?.triggered ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                          Keywords {selectedComplaint.aiDetails.keywordLayer?.triggered ? '✓' : '✕'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${selectedComplaint.aiDetails.sentimentLayer?.score < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          Sentiment: {selectedComplaint.aiDetails.sentimentLayer?.score}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                          Score: {selectedComplaint.aiDetails.totalScore}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Update Status</label>
                    <select 
                      value={updateData.status} 
                      onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🔄 In Progress</option>
                      <option value="Resolved">✅ Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Department</label>
                    <input
                      type="text" 
                      placeholder="e.g. Facilities Management"
                      value={updateData.assignedDepartment}
                      onChange={(e) => setUpdateData({ ...updateData, assignedDepartment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-slate-400" /> Resolution Notes
                    </label>
                    <textarea
                      placeholder="Detail the steps taken to resolve this issue..."
                      value={updateData.resolutionMessage}
                      onChange={(e) => setUpdateData({ ...updateData, resolutionMessage: e.target.value })}
                      rows="4"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-y placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleUpdate} 
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
                  >
                    <Save size={18} /> Save Update
                  </button>
                  <button 
                    onClick={() => setSelected(null)} 
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageComplaints;
