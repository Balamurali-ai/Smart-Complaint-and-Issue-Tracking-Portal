const Complaint = require('../models/Complaint');
const { analyzePriority } = require('../services/priorityService');

exports.createComplaint = async (req, res) => {
  try {
    const title       = req.body.title;
    const description = req.body.description;
    const category    = req.body.category;
    const images      = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const aiResult = analyzePriority(title, description);

    const complaint = await Complaint.create({
      userId:         req.user._id,
      title,
      description,
      category,
      images,
      priority:       aiResult.priority,
      priorityReason: aiResult.reason,
      aiGenerated:    aiResult.aiGenerated,
      aiDetails:      aiResult.details,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
