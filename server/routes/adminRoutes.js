const express = require('express');
const {
  getAllComplaints,
  updateComplaintStatus,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/complaints', protect, admin, getAllComplaints);
router.put('/update-status/:id', protect, admin, updateComplaintStatus);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
