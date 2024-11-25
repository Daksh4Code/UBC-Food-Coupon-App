const express = require('express');
const feedbackService = require('../feedbackService');
const router = express.Router();

// --- Feedback Management routes ---

// Submit Feedback
 router.post('/feedbacks/submit', async (req, res) => {
     const { accountId, sid, order_date, branchId, rating } = req.body;
     const result = await feedbackService.submitFeedback(accountId, sid, order_date, branchId, rating);
     res.json({data: result});
 });

// Update Feedback
router.put('/feedbacks/update', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    const result = await feedbackService.updateFeedback(accountId, sid, order_date, branchId, newRating);
    res.json({data: result});
});

// View Feedback
router.get('/feedbacks/view/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const feedbacks = await feedbackService.viewFeedback(accountId);
    res.json({data: feedbacks});
});

// Get Best-Rated Branch
router.get('/feedbacks/best-rated-branch', async (req, res) => {
    const branch = await feedbackService.getBestRatedBranch();
    res.json({data: branch });
});

// Delete Feedback
router.delete('/feedbacks/delete', async (req, res) => {
    const { accountId, sid, order_date, branchId } = req.body;
    const result = await feedbackService.deleteFeedback(accountId, sid, order_date, branchId);
    res.json({ data: result });
});

// Projection Query - Get restaurants by street address
router.get('/restaurants/by-address', async (req, res) => {
    const inputAddress = req.query.address; // Get address from query parameter
    const restaurants = await feedbackService.getRestaurantsByAddress(inputAddress);
    res.json({ data: restaurants });
});

module.exports = router;