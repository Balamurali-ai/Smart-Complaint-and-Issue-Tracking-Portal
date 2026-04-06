import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateComplaint } from '../services/api';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MessageSquare, Bot, Calendar, Building, Image as ImageIcon, Send, Activity, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const priorityStyle = (p) => {
  if (p === 'High') return 'bg-red-50 text-red-600 border-red-200';
  if (p === 'Medium') return 'bg-orange-50 text-orange-600 border-orange-200';
  return 'bg-emerald-50 text-emerald-600 border-emerald-200';
};

const statusStyle = (s) => {
  if (s === 'Resolved') return 'bg-emerald-100 text-emerald-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};

const layerTag = (active) => `px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
  active 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : 'bg-slate-100 text-slate-500 border-slate-200'
}`;

const ComplaintDetail = () => {
  const [complaint, setComplaint] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { 
    fetchComplaint(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await getComplaintById(id);
      setComplaint(data);
      setFeedback(data.feedback || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async () => {
    try {
      await updateComplaint(id, { feedback });
      alert('✅ Feedback submitted successfully!');
      fetchComplaint();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Complaint not found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 font-semibold hover:underline">Go Back</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 sm:pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-slate-100">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold mb-6 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${statusStyle(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${priorityStyle(complaint.priority)}`}>
                {complaint.priority === 'High' ? '🔴' : complaint.priority === 'Medium' ? '🟡' : '🟢'} {complaint.priority || 'Low'} Priority
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                <Building size={14} /> {complaint.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                <Calendar size={14} /> {new Date(complaint.createdAt).toLocaleString()}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display mb-2">{complaint.title}</h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Clock size={16} /> Ticket ID: <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{complaint._id.slice(-8).toUpperCase()}</span>
            </p>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="text-primary-500" size={20} /> Description
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {complaint.description}
              </div>
            </div>

            {/* AI Priority Analysis */}
            {complaint.aiGenerated && complaint.priorityReason && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2 relative z-10">
                  <Bot className="text-indigo-600" size={22} /> AI Priority Analysis
                </h3>
                <p className="text-indigo-800 font-medium leading-relaxed mb-6 relative z-10 bg-white/50 p-4 rounded-xl border border-indigo-100">
                  {complaint.priorityReason}
                </p>
                
                {complaint.aiDetails && (
                  <div className="relative z-10 bg-white rounded-2xl p-5 border border-indigo-100/50 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Activity size={14} /> Neural Sentiment Processing Layers
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={layerTag(complaint.aiDetails.keywordLayer?.triggered)}>
                        Layer 1 (Keywords): {complaint.aiDetails.keywordLayer?.triggered ? 'Match ✓' : 'Bypass'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${complaint.aiDetails.sentimentLayer?.isStronglyNegative ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        Layer 2 (Sentiment): {complaint.aiDetails.sentimentLayer?.score}
                      </span>
                      <span className={layerTag(complaint.aiDetails.fallbackLayer?.triggered)}>
                        Layer 3 (Fallback): {complaint.aiDetails.fallbackLayer?.triggered ? 'Triggered ✓' : 'Bypass'}
                      </span>
                      <span className={layerTag(complaint.aiDetails.similarityLayer?.triggered)}>
                        Layer 4 (Pattern): {complaint.aiDetails.similarityLayer?.triggered ? 'Found ✓' : 'Bypass'}
                      </span>
                      <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white border border-indigo-700 ml-auto">
                        Total Compute Score: {complaint.aiDetails.totalScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Images Grid */}
            {complaint.images && complaint.images.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="text-primary-500" size={20} /> Attached Evidence
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {complaint.images.map((src, i) => (
                    <a 
                      key={i} 
                      href={`http://localhost:5000${src}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-square block bg-slate-100"
                    >
                      <img
                        src={`http://localhost:5000${src}`}
                        alt={`Evidence ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Resolution Information */}
            {(complaint.assignedDepartment || complaint.resolutionMessage) && (
              <div className="border-t border-slate-100 pt-10">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-primary-500" size={22} /> Resolution Details
                </h3>
                
                <div className="space-y-4">
                  {complaint.assignedDepartment && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0"><Building size={20} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-blue-900 mb-1">Assigned Department</h4>
                        <p className="text-blue-800 font-medium">{complaint.assignedDepartment}</p>
                      </div>
                    </div>
                  )}

                  {complaint.resolutionMessage && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" /> Resolution Notes
                      </h4>
                      <div className="bg-white rounded-xl p-5 border border-emerald-100/50 text-emerald-800 font-medium leading-relaxed">
                        {complaint.resolutionMessage}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {complaint.status === 'Resolved' && (
              <div className="bg-amber-50 shrink-0 border border-amber-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>
                
                <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2 relative z-10">
                  <MessageSquare className="text-amber-600" size={22} /> Provide Feedback
                </h3>
                <p className="text-amber-800/80 font-medium text-sm mb-6 relative z-10">
                  Your issue was marked as resolved. Please share your experience regarding the resolution.
                </p>
                
                <div className="relative z-10">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your feedback about the resolution process. Were you satisfied?"
                    rows="4"
                    className="w-full bg-white/80 border border-amber-200 text-slate-800 p-4 rounded-2xl font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none resize-y transition-all placeholder:text-amber-700/40"
                  />
                  <button 
                    onClick={handleFeedback}
                    className="mt-4 flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
                  >
                    <Send size={18} /> Submit Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
