const express = require('express');
const appService = require('../feedbackService');
const router = express.Router();

// --- Feedback Management API endpoints:

// Submit Feedback
 router.post('/feedbacks/submit', async (req, res) => {
     const { accountId, sid, order_date, branchId, rating } = req.body;
     const result = await appService.submitFeedback(accountId, sid, order_date, branchId, rating);
     res.json({data: result});
 });

// Update Feedback
router.put('/feedbacks/update', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    const result = await appService.updateFeedback(accountId, sid, order_date, branchId, newRating);
    res.json({data: result});
});

// View Feedback
router.get('/feedbacks/view/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const feedbacks = await appService.viewFeedback(accountId);
    res.json({data: feedbacks});
});

// Get Best-Rated Branch
router.get('/feedbacks/best-rated-branch', async (req, res) => {
    const branch = await appService.getBestRatedBranch();
    res.json({data: branch});
});

module.exports = router;