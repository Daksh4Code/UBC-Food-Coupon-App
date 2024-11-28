const express = require('express');
const feedbackService = require('../feedbackService');
const router = express.Router();

// --- Feedback Management routes ---

// Get all feedbacks (to display in the table)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        res.json({ data: feedbacks });
    } catch (error) {
        res.status(500).send("Error fetching feedbacks.");
    }
});

// Submit Feedback
router.post('/submit', async (req, res) => {
    const { accountId, sid, order_date, branchId, rating } = req.body;
    try {
        const result = await feedbackService.submitFeedback(accountId, sid, order_date, branchId, rating);
        res.json({ data: result });
    } catch (error) {
        res.send("Error submitting feedback.");
    }
});

// Update Feedback
router.put('/update', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    try {
        const result = await feedbackService.updateFeedback(accountId, sid, order_date, branchId, newRating);
        res.json({ data: result });
    } catch (error) {
        res.send("Error updating feedback.");
    }
});

// View Feedback
router.get('/view/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    try {
        const feedbacks = await feedbackService.viewFeedback(accountId);
        res.json({ data: feedbacks });
    } catch (error) {
        res.send("Error viewing feedback.");
    }
});

// Get Best-Rated Branch
router.get('/best-rated-branch', async (req, res) => {
    try {
        const branch = await feedbackService.getBestRatedBranch();
        res.json({ data: branch });
    } catch (error) {
        res.send("Error fetching best-rated branch.");
    }
});

// Delete Feedback
router.delete('/delete', async (req, res) => {
    const { accountId, sid, order_date, branchId } = req.body;
    try {
        const result = await feedbackService.deleteFeedback(accountId, sid, order_date, branchId);
        res.json({ data: result });
    } catch (error) {
        res.send("Error deleting feedback.");
    }
});

module.exports = router;