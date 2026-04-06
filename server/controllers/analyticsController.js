const Complaint = require('../models/Complaint');

// Helper function to build a base query depending on the role
const getBaseQuery = (req) => {
  return req.user.role === 'admin' ? {} : { userId: req.user._id };
};

exports.getOverview = async (req, res) => {
  try {
    const query = getBaseQuery(req);
    const totalComplaints = await Complaint.countDocuments(query);
    const highPriority = await Complaint.countDocuments({ ...query, priority: 'High' });
    
    // Resolution rate
    const resolved = await Complaint.countDocuments({ ...query, status: 'Resolved' });
    const resolutionRate = totalComplaints > 0 ? ((resolved / totalComplaints) * 100).toFixed(1) : 0;

    // Most complained category
    const categoryStats = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const mostComplainedCategory = categoryStats.length > 0 ? categoryStats[0]._id : 'N/A';

    // AI Insights - Simple Logic
    // Most recurring issue (based on priority logic or just category for simplicity)
    const activeCategory = categoryStats.length > 0 ? categoryStats[0]._id : 'N/A';
    
    // Get month trends to see if complaints are rising
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentQuery = { ...query, createdAt: { $gte: thirtyDaysAgo } };
    const recentComplaints = await Complaint.countDocuments(recentQuery);
    
    const olderQuery = { ...query, createdAt: { $lt: thirtyDaysAgo, $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    const olderComplaints = await Complaint.countDocuments(olderQuery);
    
    const trend = recentComplaints > olderComplaints ? 'Rising' : 'Stable or Falling';
    
    res.json({
      totalComplaints,
      highPriorityComplaints: highPriority,
      resolutionRate,
      mostComplainedCategory,
      insights: {
        mostRecurringIssue: activeCategory, // Simplified due to lack of deep text analysis
        mostActiveCategory: activeCategory,
        trend,
        resolutionPerformance: resolved === totalComplaints && totalComplaints > 0 ? 'Excellent' : resolved > 0 ? 'Good' : 'Needs Improvement',
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const query = getBaseQuery(req);
    const data = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$category', value: { $sum: 1 } } }
    ]);
    const result = data.map(d => ({ name: d._id, value: d.value }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getPriorities = async (req, res) => {
  try {
    const query = getBaseQuery(req);
    const data = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const result = data.map(d => ({ name: d._id || 'Low', count: d.count }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const query = getBaseQuery(req);
    const data = await Complaint.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          complaints: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const result = data.map(d => {
      const monthStr = new Date(d._id.year, d._id.month - 1, 1).toLocaleString('default', { month: 'short' });
      return {
        name: `${monthStr} ${d._id.year}`,
        complaints: d.complaints
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
