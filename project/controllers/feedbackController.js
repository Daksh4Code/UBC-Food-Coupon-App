const express = require('express');
const appService = require('../appService');
const userQueries = require('../user_queries.sql'); // Ensure correct path to user queries
const feedbackQueries = require('../feedback_queries.sql'); // Ensure correct path to feedback queries
const router = express.Router();

// --- Feedback Management Routes ---

// Submit Feedback
router.post('/submit-feedback', async (req, res) => {
    const { accountId, sid, order_date, branchId, rating } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                feedbackQueries.submitFeedback, // Ensure appropriate query in your SQL file
                { account_id: accountId, sid, order_date, branch_id: branchId, rating },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ success: false, error: 'Failed to submit feedback' });
        }
    });
});

// Update Feedback
router.put('/update-feedback', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                feedbackQueries.updateFeedback, // Ensure appropriate query in your SQL file
                { new_rating: newRating, account_id: accountId, sid, order_date, branch_id: branchId },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating feedback:', error);
            res.status(500).json({ success: false, error: 'Failed to update feedback' });
        }
    });
});

// View Feedback
router.get('/view-feedback/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(feedbackQueries.viewFeedback, { account_id: accountId });
            res.json({ success: true, feedback: result.rows });
        } catch (error) {
            console.error('Error viewing feedback:', error);
            res.status(500).json({ success: false, error: 'Failed to view feedback' });
        }
    });
});

// Get Best-Rated Branch
router.get('/best-rated-branch', async (req, res) => {
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(feedbackQueries.bestRatedBranch);
            res.json({ success: true, branchId: result.rows[0].branch_id });
        } catch (error) {
            console.error('Error finding best-rated branch:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to find best-rated branch'
            });
        }
    });
});

module.exports = router;