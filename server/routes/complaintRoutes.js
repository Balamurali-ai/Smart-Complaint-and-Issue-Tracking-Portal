const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// upload.array('images', 5) — field name must match FormData key, max 5 files
router.post('/',    protect, upload.array('images', 5), createComplaint);
router.get('/',     protect, getComplaints);
router.get('/:id',  protect, getComplaintById);
router.put('/:id',  protect, updateComplaint);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
