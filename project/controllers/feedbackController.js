const express = require('express');
const appService = require('../appService');
const router = express.Router();

// --- Feedback Management Routes ---

// Submit Feedback
router.post('/feedbacks/submit', async (req, res) => {
    const { accountId, sid, order_date, branchId, rating } = req.body;
    try {
        const result = await appService.submitFeedback(accountId, sid, order_date, branchId, rating);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, error: 'Failed to submit feedback' });
    }
});

// Update Feedback
router.put('/feedbacks/update', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    try {
        const result = await appService.updateFeedback(accountId, sid, order_date, branchId, newRating);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ success: false, error: 'Failed to update feedback' });
    }
});

// View Feedback
router.get('/feedbacks/view/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    try {
        const feedbacks = await appService.viewFeedback(accountId);
        res.json({ success: true, feedbacks });
    } catch (error) {
        console.error(`Error viewing feedback for account ID ${accountId}:`, error);
        res.status(500).json({ success: false, error: 'Failed to view feedback' });
    }
});

// Get Best-Rated Branch
router.get('/feedbacks/best-rated-branch', async (req, res) => {
    try {
        const branch = await appService.getBestRatedBranch();
        res.json({ success: true, branch });
    } catch (error) {
        console.error('Error finding best-rated branch:', error);
        res.status(500).json({ success: false, error: 'Failed to find best-rated branch' });
    }
});

module.exports = router;