const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Hostel', 'Academic', 'Infrastructure', 'Other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  // ── AI Priority ─────────────────────────────────────
  priority:       { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  priorityReason: { type: String, default: '' },
  aiGenerated:    { type: Boolean, default: false },
  aiDetails:      { type: mongoose.Schema.Types.Mixed, default: {} },
  // ── Images (multiple) ───────────────────────────────
  images: [{ type: String }],
  // ── Resolution ──────────────────────────────────────
  assignedDepartment: { type: String, default: '' },
  resolutionMessage:  { type: String, default: '' },
  feedback:           { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
