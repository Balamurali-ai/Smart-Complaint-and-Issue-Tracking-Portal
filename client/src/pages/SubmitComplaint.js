import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../services/api';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Image as ImageIcon, X, Plus, AlertCircle } from 'lucide-react';

const SubmitComplaint = () => {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]     = useState('Hostel');
  const [images, setImages]         = useState([]);   // File objects
  const [previews, setPreviews]     = useState([]);   // base64 preview URLs
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }
    setError('');
    const newFiles = [];
    const newPreviews = [];
    files.forEach((file) => {
      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setImages((prev) => [...prev, ...newFiles]);
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      images.forEach((img) => formData.append('images', img));

      await createComplaint(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-24 sm:pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <button 
                  type="button"
                  onClick={() => navigate('/student/dashboard')}
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-4 transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>
                <h2 className="text-3xl font-extrabold font-display">Submit New Complaint</h2>
                <p className="text-primary-100 mt-2 font-medium max-w-sm">Provide detailed information so our AI can accurately assign priority and categorize your issue.</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3 font-medium text-sm"
                >
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Complaint Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Broken water pipe in hostel block A"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Describe the issue in detail. Include location, time, and impact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="5"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Category <span className="text-red-500">*</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none cursor-pointer"
                >
                  <option value="Hostel">🏠 Hostel</option>
                  <option value="Academic">📚 Academic</option>
                  <option value="Infrastructure">🏗️ Infrastructure</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Upload Evidence <span className="text-slate-400 font-normal ml-1">(Optional, max 5)</span></label>
                
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl cursor-pointer transition-colors group">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <div className="font-bold text-indigo-600 mb-1">Click to choose images</div>
                  <div className="text-xs text-slate-500 font-medium">JPG, PNG, WEBP · Max 5MB each</div>
                </label>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 text-white text-[10px] font-medium truncate text-center backdrop-blur-sm">
                          {images[i]?.name}
                        </div>
                      </div>
                    ))}
                    
                    {previews.length < 5 && (
                      <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer aspect-square transition-colors text-slate-400 hover:text-indigo-500">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Plus size={24} />
                        <span className="text-xs font-semibold mt-1">Add More</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Submit Complaint
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/student/dashboard')}
                  className="py-4 px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SubmitComplaint;
