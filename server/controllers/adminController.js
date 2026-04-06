const Complaint = require('../models/Complaint');

exports.getAllComplaints = async (req, res) => {
  try {
    const { category, status, priority } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedDepartment, resolutionMessage } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, assignedDepartment, resolutionMessage },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const total        = await Complaint.countDocuments();
    const pending      = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress   = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved     = await Complaint.countDocuments({ status: 'Resolved' });
    const highPriority = await Complaint.countDocuments({ priority: 'High' });

    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ total, pending, inProgress, resolved, highPriority, categoryStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
