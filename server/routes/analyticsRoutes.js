const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, analyticsController.getOverview);
router.get('/categories', protect, analyticsController.getCategories);
router.get('/priorities', protect, analyticsController.getPriorities);
router.get('/trends', protect, analyticsController.getTrends);

module.exports = router;
