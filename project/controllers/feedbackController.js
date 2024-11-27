const express = require('express');
const feedbackService = require('../feedbackService');
const router = express.Router();

// --- Feedback Management routes ---

// Submit Feedback
 router.post('/feedbacks/submit', async (req, res) => {
    const { accountId, sid, order_date, branchId, rating } = req.body;
    try {
        const result = await feedbackService.submitFeedback(accountId, sid, order_date, branchId, rating);
        res.json({ data: result });
    } catch (error) {
        res.send("Error submitting feedback.");
    }
});

// Update Feedback
router.put('/feedbacks/update', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    try {
        const result = await feedbackService.updateFeedback(accountId, sid, order_date, branchId, newRating);
        res.json({ data: result });
    } catch (error) {
        res.send("Error updating feedback.");
    }
});

// View Feedback
router.get('/feedbacks/view/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    try {
        const feedbacks = await feedbackService.viewFeedback(accountId);
        res.json({ data: feedbacks });
    } catch (error) {
        res.send("Error viewing feedback.");
    }
});

// Get Best-Rated Branch
router.get('/feedbacks/best-rated-branch', async (req, res) => {
    try {
        const branch = await feedbackService.getBestRatedBranch();
        res.json({ data: branch });
    } catch (error) {
        res.send("Error fetching best-rated branch.");
    }
});

// Delete Feedback
router.delete('/feedbacks/delete', async (req, res) => {
    const { accountId, sid, order_date, branchId } = req.body;
    try {
        const result = await feedbackService.deleteFeedback(accountId, sid, order_date, branchId);
        res.json({ data: result });
    } catch (error) {
        res.send("Error deleting feedback.");
    }
});

// Projection Query - Get restaurants by street address
router.get('/restaurants/by-address', async (req, res) => {
    const inputAddress = req.query.address;
    try {
        const restaurants = await feedbackService.getRestaurantsByAddress(inputAddress);
        res.json({ data: restaurants });
    } catch (error) {
        res.send("Error fetching restaurants by address.");
    }
});

module.exports = router;